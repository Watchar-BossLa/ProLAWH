
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reactions: Record<string, string[]>;
  reply_to?: string;
}

export interface TypingUser {
  user_id: string;
  user_name?: string;
  last_activity: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface UploadedFile {
  url: string;
  name: string;
}

export function useRealtimeChat(connectionId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>('offline');

  // Mock implementation for now
  useEffect(() => {
    if (connectionId) {
      setOnlineStatus('online');
      
      // Mock some initial messages
      setMessages([
        {
          id: '1',
          content: 'Hello! This is a test message.',
          sender_id: 'user1',
          sender_name: 'John Doe',
          sender_avatar: '',
          timestamp: new Date().toISOString(),
          type: 'text',
          reactions: {}
        }
      ]);
    }
  }, [connectionId]);

  const sendMessage = useCallback(async (params: {
    content: string;
    type: 'text' | 'file' | 'image';
    file_url?: string;
    file_name?: string;
  }) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: params.content,
      sender_id: user.id,
      sender_name: user.email || 'Anonymous',
      timestamp: new Date().toISOString(),
      type: params.type,
      file_url: params.file_url,
      file_name: params.file_name,
      reactions: {}
    };

    setMessages(prev => [...prev, newMessage]);
  }, [user]);

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    // Mock implementation
    console.log('Typing indicator:', isTyping);
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    try {
      // Mock file upload
      const mockUrl = URL.createObjectURL(file);
      return {
        url: mockUrl,
        name: file.name
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, []);

  const addReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions[reaction] || [];
        if (!currentReactions.includes(user.id)) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [reaction]: [...currentReactions, user.id]
            }
          };
        }
      }
      return msg;
    }));
  }, [user]);

  const removeReaction = useCallback(async (messageId: string, reaction: string) => {
    if (!user) return;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions[reaction] || [];
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reaction]: currentReactions.filter(id => id !== user.id)
          }
        };
      }
      return msg;
    }));
  }, [user]);

  return {
    messages,
    sendMessage,
    sendTypingIndicator,
    uploadFile,
    addReaction,
    removeReaction,
    typingUsers,
    onlineStatus
  };
}
