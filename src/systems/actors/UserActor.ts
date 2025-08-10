/**
 * User Actor - Manages individual user's communication state and presence
 * Handles user-specific messaging, notifications, and connection management
 */

import { Actor, ActorMessage, MessageRouter } from './ActorSystem';
import { supabase } from '@/integrations/supabase/client';

export interface UserState {
  userId: string;
  profile: any;
  activeChats: Set<string>;
  mentorshipSessions: Set<string>;
  connectionStatus: 'online' | 'away' | 'busy' | 'offline';
  lastActivity: string;
  notifications: any[];
  typingInChats: Set<string>;
  unreadCounts: Map<string, number>;
}

export class UserActor extends Actor {
  private userState: UserState;
  private messageRouter: MessageRouter;
  private presenceInterval?: ReturnType<typeof setInterval>;
  private notificationCallbacks: Set<(type: string, data: any) => void> = new Set();

  constructor(userId: string, profile: any, supervisor?: Actor) {
    super(`user-${userId}`, 'user', supervisor);
    
    this.userState = {
      userId,
      profile,
      activeChats: new Set(),
      mentorshipSessions: new Set(),
      connectionStatus: 'online',
      lastActivity: new Date().toISOString(),
      notifications: [],
      typingInChats: new Set(),
      unreadCounts: new Map()
    };

    this.messageRouter = MessageRouter.getInstance();
    this.startPresenceHeartbeat();
    
    console.log(`User actor created for: ${userId}`);
  }

  async handle(message: ActorMessage): Promise<void> {
    console.log(`User ${this.userState.userId} handling message:`, message.type);

    switch (message.type) {
      case 'join_chat':
        await this.handleJoinChat(message);
        break;
      case 'leave_chat':
        await this.handleLeaveChat(message);
        break;
      case 'new_message':
        await this.handleNewMessage(message);
        break;
      case 'typing_users_updated':
        await this.handleTypingUsersUpdated(message);
        break;
      case 'presence_updated':
        await this.handlePresenceUpdated(message);
        break;
      case 'reaction_updated':
        await this.handleReactionUpdated(message);
        break;
      case 'messages_read':
        await this.handleMessagesRead(message);
        break;
      case 'room_state':
        await this.handleRoomState(message);
        break;
      case 'messages_synced':
        await this.handleMessagesSynced(message);
        break;
      case 'user_joined':
        await this.handleUserJoined(message);
        break;
      case 'user_left':
        await this.handleUserLeft(message);
        break;
      case 'message_error':
        await this.handleMessageError(message);
        break;
      case 'notification':
        await this.handleNotification(message);
        break;
      case 'update_status':
        await this.handleUpdateStatus(message);
        break;
      case 'get_user_state':
        await this.handleGetUserState(message);
        break;
      case 'start_mentorship_session':
        await this.handleStartMentorshipSession(message);
        break;
      case 'end_mentorship_session':
        await this.handleEndMentorshipSession(message);
        break;
      default:
        console.warn(`User actor: Unknown message type: ${message.type}`);
    }

    this.userState.lastActivity = new Date().toISOString();
  }

  private async handleJoinChat(message: ActorMessage): Promise<void> {
    const { chatId } = message.payload;
    
    this.userState.activeChats.add(chatId);
    this.userState.unreadCounts.set(chatId, 0);

    // Send join message to chat room
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'join',
        {
          userId: this.userState.userId,
          userProfile: this.userState.profile
        }
      )
    );

    console.log(`User ${this.userState.userId} joined chat ${chatId}`);
  }

  private async handleLeaveChat(message: ActorMessage): Promise<void> {
    const { chatId } = message.payload;
    
    this.userState.activeChats.delete(chatId);
    this.userState.typingInChats.delete(chatId);
    this.userState.unreadCounts.delete(chatId);

    // Send leave message to chat room
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'leave',
        {
          userId: this.userState.userId
        }
      )
    );

    console.log(`User ${this.userState.userId} left chat ${chatId}`);
  }

  private async handleNewMessage(message: ActorMessage): Promise<void> {
    const messageData = message.payload;
    
    // Extract chat ID from message
    const chatId = messageData.connection_id;
    
    // Update unread count if user is not the sender
    if (messageData.sender_id !== this.userState.userId) {
      const currentCount = this.userState.unreadCounts.get(chatId) || 0;
      this.userState.unreadCounts.set(chatId, currentCount + 1);
    }

    // Trigger UI update through callback
    this.triggerUIUpdate('new_message', messageData);

    // Send notification if user is not actively viewing the chat
    if (!this.isActiveInChat(chatId)) {
      await this.sendNotification({
        type: 'new_message',
        chatId,
        sender: messageData.sender_profile?.full_name || 'Someone',
        preview: messageData.content.substring(0, 50),
        timestamp: messageData.created_at
      });
    }
  }

  private async handleTypingUsersUpdated(message: ActorMessage): Promise<void> {
    const { typingUsers } = message.payload;
    
    this.triggerUIUpdate('typing_users_updated', {
      typingUsers: typingUsers.filter((userId: string) => userId !== this.userState.userId)
    });
  }

  private async handlePresenceUpdated(message: ActorMessage): Promise<void> {
    const { presenceData } = message.payload;
    
    this.triggerUIUpdate('presence_updated', { presenceData });
  }

  private async handleReactionUpdated(message: ActorMessage): Promise<void> {
    const { messageId, reactions } = message.payload;
    
    this.triggerUIUpdate('reaction_updated', { messageId, reactions });
  }

  private async handleMessagesRead(message: ActorMessage): Promise<void> {
    const { messageIds, userId } = message.payload;
    
    this.triggerUIUpdate('messages_read', { messageIds, userId });
  }

  private async handleRoomState(message: ActorMessage): Promise<void> {
    const roomState = message.payload;
    
    // Update unread count based on recent messages
    const unreadCount = roomState.recentMessages.filter(
      (msg: any) => msg.sender_id !== this.userState.userId && 
                   !msg.read_by?.includes(this.userState.userId)
    ).length;
    
    this.userState.unreadCounts.set(roomState.roomId, unreadCount);
    
    this.triggerUIUpdate('room_state', roomState);
  }

  private async handleMessagesSynced(message: ActorMessage): Promise<void> {
    const { messages } = message.payload;
    
    this.triggerUIUpdate('messages_synced', { messages });
  }

  private async handleUserJoined(message: ActorMessage): Promise<void> {
    this.triggerUIUpdate('user_joined', message.payload);
  }

  private async handleUserLeft(message: ActorMessage): Promise<void> {
    this.triggerUIUpdate('user_left', message.payload);
  }

  private async handleMessageError(message: ActorMessage): Promise<void> {
    const { error, originalMessage } = message.payload;
    
    this.triggerUIUpdate('message_error', { error, originalMessage });
    
    await this.sendNotification({
      type: 'error',
      message: error,
      timestamp: new Date().toISOString()
    });
  }

  private async handleNotification(message: ActorMessage): Promise<void> {
    const notification = message.payload;
    
    this.userState.notifications.push({
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 notifications
    if (this.userState.notifications.length > 50) {
      this.userState.notifications = this.userState.notifications.slice(-50);
    }

    this.triggerUIUpdate('notification', notification);
  }

  private async handleUpdateStatus(message: ActorMessage): Promise<void> {
    const { status } = message.payload;
    
    this.userState.connectionStatus = status;
    
    // Broadcast status update to all active chats
    const promises = Array.from(this.userState.activeChats).map(chatId =>
      this.messageRouter.route(
        this.messageRouter.createMessage(
          `chat-room-${chatId}`,
          this.id,
          'presence_update',
          {
            userId: this.userState.userId,
            status,
            lastSeen: new Date().toISOString()
          }
        )
      )
    );

    await Promise.all(promises);
  }

  private async handleGetUserState(message: ActorMessage): Promise<void> {
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        message.from,
        this.id,
        'user_state_response',
        {
          userState: this.getUserState(),
          requestId: message.payload.requestId
        }
      )
    );
  }

  private async handleStartMentorshipSession(message: ActorMessage): Promise<void> {
    const { sessionId } = message.payload;
    
    this.userState.mentorshipSessions.add(sessionId);
    
    console.log(`User ${this.userState.userId} started mentorship session ${sessionId}`);
  }

  private async handleEndMentorshipSession(message: ActorMessage): Promise<void> {
    const { sessionId } = message.payload;
    
    this.userState.mentorshipSessions.delete(sessionId);
    
    console.log(`User ${this.userState.userId} ended mentorship session ${sessionId}`);
  }

  // Public API methods
  async sendMessage(chatId: string, content: string, options: any = {}): Promise<void> {
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'send_message',
        {
          content,
          senderId: this.userState.userId,
          messageType: options.type || 'text',
          fileUrl: options.fileUrl,
          fileName: options.fileName,
          replyToId: options.replyToId
        }
      )
    );
  }

  async startTyping(chatId: string): Promise<void> {
    this.userState.typingInChats.add(chatId);
    
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'typing_start',
        { userId: this.userState.userId }
      )
    );
  }

  async stopTyping(chatId: string): Promise<void> {
    this.userState.typingInChats.delete(chatId);
    
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'typing_stop',
        { userId: this.userState.userId }
      )
    );
  }

  async addReaction(chatId: string, messageId: string, emoji: string): Promise<void> {
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'add_reaction',
        {
          messageId,
          emoji,
          userId: this.userState.userId
        }
      )
    );
  }

  async markMessagesRead(chatId: string, messageIds: string[]): Promise<void> {
    // Reset unread count for this chat
    this.userState.unreadCounts.set(chatId, 0);
    
    await this.messageRouter.route(
      this.messageRouter.createMessage(
        `chat-room-${chatId}`,
        this.id,
        'mark_read',
        {
          messageIds,
          userId: this.userState.userId
        }
      )
    );
  }

  async updateConnectionStatus(status: 'online' | 'away' | 'busy' | 'offline'): Promise<void> {
    await this.send({
      to: this.id,
      from: this.id,
      type: 'update_status',
      payload: { status },
      timestamp: new Date().toISOString(),
      id: `status-update-${Date.now()}`
    });
  }

  // UI callback management
  addUICallback(callback: (type: string, data: any) => void): void {
    this.notificationCallbacks.add(callback);
  }

  removeUICallback(callback: (type: string, data: any) => void): void {
    this.notificationCallbacks.delete(callback);
  }

  private triggerUIUpdate(type: string, data: any): void {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Error in UI callback:', error);
      }
    });
  }

  private async sendNotification(notification: any): Promise<void> {
    await this.send({
      to: this.id,
      from: 'system',
      type: 'notification',
      payload: notification,
      timestamp: new Date().toISOString(),
      id: `notification-${Date.now()}`
    });
  }

  private isActiveInChat(chatId: string): boolean {
    // In a real implementation, this would check if the user is currently viewing the chat
    return this.userState.activeChats.has(chatId);
  }

  private startPresenceHeartbeat(): void {
    this.presenceInterval = setInterval(() => {
      this.updateConnectionStatus(this.userState.connectionStatus);
    }, 30000); // 30 seconds
  }

  getUserState(): UserState {
    return { ...this.userState };
  }

  getUnreadCount(chatId?: string): number {
    if (chatId) {
      return this.userState.unreadCounts.get(chatId) || 0;
    }
    
    // Return total unread count
    return Array.from(this.userState.unreadCounts.values()).reduce((sum, count) => sum + count, 0);
  }

  getActiveChats(): string[] {
    return Array.from(this.userState.activeChats);
  }

  stop(): void {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }
    
    super.stop();
  }
}
