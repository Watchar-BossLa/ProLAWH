
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ChatRoom {
  id: string;
  name: string;
  type: 'group' | 'direct';
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  participant_count?: number;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_id?: string;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  reactions: MessageReaction[];
  read_receipts: ReadReceipt[];
  reply_to?: ChatMessage;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  user_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface TypingIndicator {
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  last_activity: string;
  user_profile?: {
    full_name?: string;
  };
}

export function useRealTimeChat(chatId?: string) {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatRoom | null>(null);

  // Mock implementation for now since the database tables aren't available yet
  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      // Mock data for development
      const mockRooms: ChatRoom[] = [
        {
          id: '1',
          name: 'General Discussion',
          type: 'group',
          created_by: user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          participant_count: 5,
        },
        {
          id: '2',
          name: 'Direct Chat',
          type: 'direct',
          created_by: user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          participant_count: 2,
        }
      ];

      setChatRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load chat rooms",
        variant: "destructive"
      });
    }
  }, [user]);

  const fetchMessages = useCallback(async (roomId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Mock messages for development
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          chat_id: roomId,
          sender_id: user.id,
          content: 'Hello everyone!',
          message_type: 'text',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          sender_profile: {
            full_name: user.user_metadata?.full_name || 'You',
          },
          reactions: [],
          read_receipts: [],
        },
        {
          id: '2',
          chat_id: roomId,
          sender_id: 'other-user',
          content: 'Hi there! How are you?',
          message_type: 'text',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString(),
          sender_profile: {
            full_name: 'John Doe',
          },
          reactions: [],
          read_receipts: [],
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (
    content: string,
    messageType: 'text' | 'file' | 'image' = 'text',
    fileData?: { url: string; name: string; size: number },
    replyToId?: string
  ) => {
    if (!user || !chatId) return;

    try {
      // Mock implementation - in real app this would save to database
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        chat_id: chatId,
        sender_id: user.id,
        content,
        message_type: messageType,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_size: fileData?.size,
        reply_to_id: replyToId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_profile: {
          full_name: user.user_metadata?.full_name || 'You',
        },
        reactions: [],
        read_receipts: [],
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user, chatId]);

  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      // Mock implementation
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.user_id === user.id && r.reaction === reaction);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter(r => !(r.user_id === user.id && r.reaction === reaction))
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, {
                id: Date.now().toString(),
                message_id: messageId,
                user_id: user.id,
                reaction,
                created_at: new Date().toISOString()
              }]
            };
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [user]);

  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;

    try {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions.filter(r => !(r.user_id === user.id && r.reaction === reaction))
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      // Mock implementation
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const hasRead = msg.read_receipts.some(r => r.user_id === user.id);
          if (!hasRead) {
            return {
              ...msg,
              read_receipts: [...msg.read_receipts, {
                id: Date.now().toString(),
                message_id: messageId,
                user_id: user.id,
                read_at: new Date().toISOString()
              }]
            };
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [user]);

  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!user || !chatId) return;

    try {
      // Mock implementation
      if (isTyping) {
        setTypingUsers(prev => {
          const existing = prev.find(t => t.user_id === user.id && t.chat_id === chatId);
          if (existing) return prev;
          
          return [...prev, {
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            last_activity: new Date().toISOString(),
            user_profile: {
              full_name: user.user_metadata?.full_name || 'You'
            }
          }];
        });
      } else {
        setTypingUsers(prev => prev.filter(t => !(t.user_id === user.id && t.chat_id === chatId)));
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [user, chatId]);

  const createDirectChat = useCallback(async (otherUserId: string) => {
    if (!user) return;

    try {
      // Mock implementation
      const newChat: ChatRoom = {
        id: Date.now().toString(),
        name: 'Direct Chat',
        type: 'direct',
        created_by: user.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participant_count: 2,
      };
      
      setChatRooms(prev => [...prev, newChat]);
      return newChat.id;
    } catch (error) {
      console.error('Error creating direct chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive"
      });
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user, fetchChatRooms]);

  // Load messages when chat changes
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      
      // Find current chat
      const chat = chatRooms.find(room => room.id === chatId);
      setCurrentChat(chat || null);
    }
  }, [chatId, fetchMessages, chatRooms]);

  return {
    chatRooms,
    messages,
    typingUsers,
    currentChat,
    isLoading,
    sendMessage,
    addReaction,
    removeReaction,
    markAsRead,
    updateTypingStatus,
    createDirectChat,
    refreshChatRooms: fetchChatRooms,
    refreshMessages: () => chatId && fetchMessages(chatId)
  };
}
