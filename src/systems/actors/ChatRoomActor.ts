/**
 * Chat Room Actor - Manages individual chat room state and messaging
 * Implements Erlang-inspired GenServer pattern for chat room management
 */

import { Actor, ActorMessage, MessageRouter } from './ActorSystem';
import { supabase } from '@/integrations/supabase/client';

export interface ChatRoomState {
  roomId: string;
  participants: Set<string>;
  messages: any[];
  typingUsers: Set<string>;
  presenceData: Map<string, any>;
  connectionCount: number;
  lastActivity: string;
}

export class ChatRoomActor extends Actor {
  private roomState: ChatRoomState;
  private messageRouter: MessageRouter;
  private heartbeatInterval?: NodeJS.Timeout;
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(roomId: string, supervisor?: Actor) {
    super(`chat-room-${roomId}`, 'chat', supervisor);
    
    this.roomState = {
      roomId,
      participants: new Set(),
      messages: [],
      typingUsers: new Set(),
      presenceData: new Map(),
      connectionCount: 0,
      lastActivity: new Date().toISOString()
    };

    this.messageRouter = MessageRouter.getInstance();
    this.startHeartbeat();
    
    // Set up real-time subscriptions
    this.setupRealtimeSubscriptions();
  }

  async handle(message: ActorMessage): Promise<void> {
    console.log(`ChatRoom ${this.roomState.roomId} handling message:`, message.type);

    switch (message.type) {
      case 'join':
        await this.handleJoin(message);
        break;
      case 'leave':
        await this.handleLeave(message);
        break;
      case 'send_message':
        await this.handleSendMessage(message);
        break;
      case 'typing_start':
        await this.handleTypingStart(message);
        break;
      case 'typing_stop':
        await this.handleTypingStop(message);
        break;
      case 'add_reaction':
        await this.handleAddReaction(message);
        break;
      case 'mark_read':
        await this.handleMarkRead(message);
        break;
      case 'presence_update':
        await this.handlePresenceUpdate(message);
        break;
      case 'sync_messages':
        await this.handleSyncMessages(message);
        break;
      case 'heartbeat':
        await this.handleHeartbeat(message);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }

    this.roomState.lastActivity = new Date().toISOString();
  }

  private async handleJoin(message: ActorMessage): Promise<void> {
    const { userId, userProfile } = message.payload;
    
    this.roomState.participants.add(userId);
    this.roomState.connectionCount++;
    
    // Add user to presence
    this.roomState.presenceData.set(userId, {
      user_id: userId,
      status: 'online',
      last_seen: new Date().toISOString(),
      profile: userProfile
    });

    // Broadcast join event to all participants
    await this.broadcastToParticipants('user_joined', {
      userId,
      userProfile,
      participantCount: this.roomState.participants.size
    });

    // Send current room state to joining user
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `user-${userId}`,
        this.id,
        'room_state',
        {
          roomId: this.roomState.roomId,
          participants: Array.from(this.roomState.participants),
          presenceData: Object.fromEntries(this.roomState.presenceData),
          typingUsers: Array.from(this.roomState.typingUsers),
          recentMessages: this.roomState.messages.slice(-20)
        }
      )
    );

    console.log(`User ${userId} joined room ${this.roomState.roomId}`);
  }

  private async handleLeave(message: ActorMessage): Promise<void> {
    const { userId } = message.payload;
    
    this.roomState.participants.delete(userId);
    this.roomState.typingUsers.delete(userId);
    this.roomState.presenceData.delete(userId);
    this.roomState.connectionCount = Math.max(0, this.roomState.connectionCount - 1);

    // Clear typing timeout
    const typingTimeout = this.typingTimeouts.get(userId);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      this.typingTimeouts.delete(userId);
    }

    // Broadcast leave event
    await this.broadcastToParticipants('user_left', {
      userId,
      participantCount: this.roomState.participants.size
    });

    console.log(`User ${userId} left room ${this.roomState.roomId}`);

    // Stop actor if no participants
    if (this.roomState.participants.size === 0) {
      await this.scheduleShutdown();
    }
  }

  private async handleSendMessage(message: ActorMessage): Promise<void> {
    const { content, senderId, messageType, fileUrl, fileName, replyToId } = message.payload;

    try {
      // Store message in database
      const { data: newMessage, error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          sender_id: senderId,
          connection_id: this.roomState.roomId,
          message_type: messageType || 'text',
          file_url: fileUrl,
          file_name: fileName,
          reply_to_id: replyToId,
          status: 'sent'
        })
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Add to local state
      this.roomState.messages.push(newMessage);
      
      // Keep only last 100 messages in memory
      if (this.roomState.messages.length > 100) {
        this.roomState.messages = this.roomState.messages.slice(-100);
      }

      // Broadcast new message to all participants
      await this.broadcastToParticipants('new_message', newMessage);

      console.log(`Message sent in room ${this.roomState.roomId} by ${senderId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Send error back to sender
      await this.messageRouter.route(
        this.messageRouter.createMessage(
          `user-${senderId}`,
          this.id,
          'message_error',
          { error: 'Failed to send message', originalMessage: message.payload }
        )
      );
    }
  }

  private async handleTypingStart(message: ActorMessage): Promise<void> {
    const { userId } = message.payload;
    
    this.roomState.typingUsers.add(userId);

    // Clear existing timeout
    const existingTimeout = this.typingTimeouts.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set auto-stop timeout
    const timeout = setTimeout(() => {
      this.roomState.typingUsers.delete(userId);
      this.broadcastToParticipants('typing_users_updated', {
        typingUsers: Array.from(this.roomState.typingUsers)
      });
      this.typingTimeouts.delete(userId);
    }, 10000); // 10 seconds

    this.typingTimeouts.set(userId, timeout);

    // Broadcast typing update
    await this.broadcastToParticipants('typing_users_updated', {
      typingUsers: Array.from(this.roomState.typingUsers)
    });
  }

  private async handleTypingStop(message: ActorMessage): Promise<void> {
    const { userId } = message.payload;
    
    this.roomState.typingUsers.delete(userId);

    // Clear timeout
    const timeout = this.typingTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.typingTimeouts.delete(userId);
    }

    // Broadcast typing update
    await this.broadcastToParticipants('typing_users_updated', {
      typingUsers: Array.from(this.roomState.typingUsers)
    });
  }

  private async handleAddReaction(message: ActorMessage): Promise<void> {
    const { messageId, emoji, userId } = message.payload;

    try {
      // Get current message
      const { data: currentMessage, error: fetchError } = await supabase
        .from('chat_messages')
        .select('reactions')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      const currentReactions = Array.isArray(currentMessage.reactions) ? currentMessage.reactions : [];
      
      // Toggle reaction
      const existingIndex = currentReactions.findIndex(
        (r: any) => r.user_id === userId && r.emoji === emoji
      );

      let updatedReactions;
      if (existingIndex > -1) {
        // Remove reaction
        updatedReactions = currentReactions.filter((_, index) => index !== existingIndex);
      } else {
        // Add reaction
        updatedReactions = [
          ...currentReactions,
          { emoji, user_id: userId, created_at: new Date().toISOString() }
        ];
      }

      // Update in database
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ reactions: updatedReactions })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Update local state
      const messageIndex = this.roomState.messages.findIndex(m => m.id === messageId);
      if (messageIndex > -1) {
        this.roomState.messages[messageIndex].reactions = updatedReactions;
      }

      // Broadcast reaction update
      await this.broadcastToParticipants('reaction_updated', {
        messageId,
        reactions: updatedReactions
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }

  private async handleMarkRead(message: ActorMessage): Promise<void> {
    const { messageIds, userId } = message.payload;

    try {
      // Update read status in database
      for (const messageId of messageIds) {
        const { data: currentMessage } = await supabase
          .from('chat_messages')
          .select('read_by')
          .eq('id', messageId)
          .single();

        if (currentMessage) {
          const currentReadBy = Array.isArray(currentMessage.read_by) ? currentMessage.read_by : [];
          if (!currentReadBy.includes(userId)) {
            await supabase
              .from('chat_messages')
              .update({
                read_by: [...currentReadBy, userId],
                status: 'read'
              })
              .eq('id', messageId);
          }
        }
      }

      // Broadcast read update
      await this.broadcastToParticipants('messages_read', {
        messageIds,
        userId
      });

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  private async handlePresenceUpdate(message: ActorMessage): Promise<void> {
    const { userId, status, lastSeen } = message.payload;
    
    this.roomState.presenceData.set(userId, {
      user_id: userId,
      status,
      last_seen: lastSeen || new Date().toISOString()
    });

    // Broadcast presence update
    await this.broadcastToParticipants('presence_updated', {
      userId,
      status,
      presenceData: Object.fromEntries(this.roomState.presenceData)
    });
  }

  private async handleSyncMessages(message: ActorMessage): Promise<void> {
    const { userId, lastMessageId } = message.payload;

    try {
      // Fetch recent messages
      let query = supabase
        .from('chat_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(full_name, avatar_url)
        `)
        .eq('connection_id', this.roomState.roomId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (lastMessageId) {
        // Get messages after the last known message
        const { data: lastMessage } = await supabase
          .from('chat_messages')
          .select('created_at')
          .eq('id', lastMessageId)
          .single();

        if (lastMessage) {
          query = query.gt('created_at', lastMessage.created_at);
        }
      }

      const { data: messages, error } = await query;

      if (error) throw error;

      // Send synced messages to user
      await this.messageRouter.route(
        this.messageRouter.createMessage(
          `user-${userId}`,
          this.id,
          'messages_synced',
          { messages: messages?.reverse() || [] }
        )
      );

    } catch (error) {
      console.error('Error syncing messages:', error);
    }
  }

  private async handleHeartbeat(message: ActorMessage): Promise<void> {
    // Update last activity
    this.roomState.lastActivity = new Date().toISOString();
    
    // Clean up expired typing indicators
    this.cleanupExpiredTyping();
  }

  private async broadcastToParticipants(type: string, payload: any): Promise<void> {
    const promises = Array.from(this.roomState.participants).map(userId =>
      this.messageRouter.route(
        this.messageRouter.createMessage(
          `user-${userId}`,
          this.id,
          type,
          payload
        )
      )
    );

    await Promise.all(promises);
  }

  private setupRealtimeSubscriptions(): void {
    // Set up database subscriptions for external changes
    // This handles changes from other instances/clients
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        to: this.id,
        from: 'system',
        type: 'heartbeat',
        payload: {},
        timestamp: new Date().toISOString(),
        id: `heartbeat-${Date.now()}`
      });
    }, 30000); // 30 seconds
  }

  private cleanupExpiredTyping(): void {
    const now = Date.now();
    this.typingTimeouts.forEach((timeout, userId) => {
      // Additional cleanup logic if needed
    });
  }

  private async scheduleShutdown(): Promise<void> {
    // Schedule shutdown after 5 minutes of inactivity
    setTimeout(() => {
      if (this.roomState.participants.size === 0) {
        console.log(`Shutting down empty room: ${this.roomState.roomId}`);
        this.stop();
      }
    }, 300000); // 5 minutes
  }

  protected async onRestart(): Promise<void> {
    console.log(`Restarting chat room actor: ${this.roomState.roomId}`);
    
    // Reset state
    this.roomState.participants.clear();
    this.roomState.typingUsers.clear();
    this.roomState.presenceData.clear();
    this.roomState.messages = [];
    this.roomState.connectionCount = 0;
    
    // Clear timeouts
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();
    
    // Restart heartbeat
    this.startHeartbeat();
    
    // Re-setup subscriptions
    this.setupRealtimeSubscriptions();
  }

  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();
    
    super.stop();
  }

  getRoomState(): ChatRoomState {
    return { ...this.roomState };
  }
}
