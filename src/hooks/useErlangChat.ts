/**
 * Erlang-inspired Chat Hook
 * Provides React interface to the actor-based chat system
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatSupervisor } from '@/systems/actors/ChatSupervisor';
import { UserActor } from '@/systems/actors/UserActor';
import { ActorRegistry, MessageRouter } from '@/systems/actors/ActorSystem';

export interface ErlangChatMessage {
  id: string;
  content: string;
  sender_id: string;
  connection_id: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions: any[];
  reply_to_id?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ErlangChatState {
  messages: ErlangChatMessage[];
  typingUsers: string[];
  presenceData: Record<string, any>;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface SupervisorStatus {
  id: string;
  childCount: number;
  children: any[];
}

interface UserStatus {
  id: string;
  activeChats: string[];
  unreadCount: number;
}

export interface SystemStatus {
  supervisor: SupervisorStatus | null;
  user: UserStatus | null;
}

export function useErlangChat(chatId?: string) {
  const { user } = useAuth();
  const [state, setState] = useState<ErlangChatState>({
    messages: [],
    typingUsers: [],
    presenceData: {},
    connectionStatus: 'disconnected',
    unreadCount: 0,
    isLoading: false,
    error: null
  });

  const supervisorRef = useRef<ChatSupervisor | null>(null);
  const userActorRef = useRef<UserActor | null>(null);
  const registryRef = useRef<ActorRegistry | null>(null);
  const messageRouterRef = useRef<MessageRouter | null>(null);

  // Initialize actor system
  useEffect(() => {
    if (!user) return;

    const initializeActorSystem = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, connectionStatus: 'connecting' }));

        // Initialize core system components
        registryRef.current = ActorRegistry.getInstance();
        messageRouterRef.current = MessageRouter.getInstance();

        // Initialize supervisor
        supervisorRef.current = new ChatSupervisor('main-chat-supervisor');

        // Initialize user actor
        userActorRef.current = new UserActor(user.id, {
          full_name: user.user_metadata?.full_name || 'Unknown User',
          avatar_url: user.user_metadata?.avatar_url
        });

        registryRef.current.register(userActorRef.current);

        // Set up UI callback
        userActorRef.current.addUICallback(handleActorMessage);

        setState(prev => ({ ...prev, isLoading: false, connectionStatus: 'connected' }));

        console.log('Erlang-inspired actor system initialized');
      } catch (error) {
        console.error('Failed to initialize actor system:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          connectionStatus: 'disconnected',
          error: 'Failed to initialize chat system'
        }));
      }
    };

    initializeActorSystem();

    return () => {
      // Cleanup
      if (userActorRef.current) {
        userActorRef.current.stop();
        registryRef.current?.unregister(userActorRef.current.id);
      }
      if (supervisorRef.current) {
        supervisorRef.current.stop();
      }
    };
  }, [user]);

  // Join/leave chat room when chatId changes
  useEffect(() => {
    if (!chatId || !userActorRef.current || !supervisorRef.current) return;

    const joinChat = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // Start chat room if not exists
        await supervisorRef.current!.startChatRoom(chatId);

        // Join the chat room
        await userActorRef.current!.send({
          to: userActorRef.current!.id,
          from: 'system',
          type: 'join_chat',
          payload: { chatId },
          timestamp: new Date().toISOString(),
          id: `join-${Date.now()}`
        });

        setState(prev => ({ ...prev, isLoading: false }));
        console.log(`Joined chat room: ${chatId}`);
      } catch (error) {
        console.error('Failed to join chat:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to join chat room'
        }));
      }
    };

    joinChat();

    return () => {
      // Leave chat when unmounting or changing chat
      if (userActorRef.current) {
        userActorRef.current.send({
          to: userActorRef.current.id,
          from: 'system',
          type: 'leave_chat',
          payload: { chatId },
          timestamp: new Date().toISOString(),
          id: `leave-${Date.now()}`
        });
      }
    };
  }, [chatId]);

  // Handle messages from actor system
  const handleActorMessage = useCallback((type: string, data: any) => {
    switch (type) {
      case 'new_message':
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }));
        break;

      case 'messages_synced':
        setState(prev => ({
          ...prev,
          messages: data.messages.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }));
        break;

      case 'room_state':
        setState(prev => ({
          ...prev,
          messages: data.recentMessages || [],
          presenceData: data.presenceData || {},
          typingUsers: data.typingUsers || []
        }));
        break;

      case 'typing_users_updated':
        setState(prev => ({
          ...prev,
          typingUsers: data.typingUsers || []
        }));
        break;

      case 'presence_updated':
        setState(prev => ({
          ...prev,
          presenceData: { ...prev.presenceData, ...data.presenceData }
        }));
        break;

      case 'reaction_updated':
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === data.messageId
              ? { ...msg, reactions: data.reactions }
              : msg
          )
        }));
        break;

      case 'messages_read':
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            data.messageIds.includes(msg.id)
              ? { ...msg, status: 'read' as const }
              : msg
          )
        }));
        break;

      case 'user_joined':
        setState(prev => ({
          ...prev,
          presenceData: {
            ...prev.presenceData,
            [data.userId]: { status: 'online', ...data.userProfile }
          }
        }));
        break;

      case 'user_left':
        setState(prev => {
          const newPresenceData = { ...prev.presenceData };
          delete newPresenceData[data.userId];
          return {
            ...prev,
            presenceData: newPresenceData,
            typingUsers: prev.typingUsers.filter(id => id !== data.userId)
          };
        });
        break;

      case 'message_error':
        setState(prev => ({
          ...prev,
          error: data.error
        }));
        break;

      default:
        console.log('Unhandled actor message:', type, data);
    }
  }, []);

  // API methods
  const sendMessage = useCallback(async (
    content: string,
    options: {
      type?: 'text' | 'image' | 'file';
      fileUrl?: string;
      fileName?: string;
      replyToId?: string;
    } = {}
  ) => {
    if (!chatId || !userActorRef.current) {
      console.warn('Cannot send message: chat not initialized');
      return;
    }

    // Optimistic update
    const tempMessage: ErlangChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      sender_id: user!.id,
      connection_id: chatId,
      message_type: options.type || 'text',
      file_url: options.fileUrl,
      file_name: options.fileName,
      status: 'sending',
      reactions: [],
      reply_to_id: options.replyToId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender_profile: {
        full_name: user!.user_metadata?.full_name || 'You'
      }
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }));

    try {
      await userActorRef.current.sendMessage(chatId, content, options);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id),
        error: 'Failed to send message'
      }));
    }
  }, [chatId, user]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!chatId || !userActorRef.current) return;
    await userActorRef.current.addReaction(chatId, messageId, emoji);
  }, [chatId]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!chatId || !userActorRef.current) return;
    await userActorRef.current.addReaction(chatId, messageId, emoji); // Same method handles toggle
  }, [chatId]);

  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!chatId || !userActorRef.current) return;

    if (isTyping) {
      await userActorRef.current.startTyping(chatId);
    } else {
      await userActorRef.current.stopTyping(chatId);
    }
  }, [chatId]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!chatId || !userActorRef.current) return;
    await userActorRef.current.markMessagesRead(chatId, messageIds);
  }, [chatId]);

  const updateConnectionStatus = useCallback(async (status: 'online' | 'away' | 'busy' | 'offline') => {
    if (!userActorRef.current) return;
    await userActorRef.current.updateConnectionStatus(status);
  }, []);

  // Get system status
  const getSystemStatus = useCallback<() => SystemStatus>(() => {
    if (!supervisorRef.current || !userActorRef.current) {
      return { supervisor: null, user: null };
    }

    return {
      supervisor: {
        id: supervisorRef.current.id,
        childCount: supervisorRef.current.getChildCount(),
        children: supervisorRef.current.getChildrenStatus()
      },
      user: {
        id: userActorRef.current.id,
        activeChats: userActorRef.current.getActiveChats(),
        unreadCount: userActorRef.current.getUnreadCount()
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    sendMessage,
    addReaction,
    removeReaction,
    updateTypingStatus,
    markAsRead,
    updateConnectionStatus,
    
    // System info
    getSystemStatus,
    
    // Raw actors (for advanced usage)
    supervisor: supervisorRef.current,
    userActor: userActorRef.current
  };
}