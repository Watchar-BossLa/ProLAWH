
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
  read_by?: Array<{
    user_id: string;
    user_name: string;
    user_avatar?: string;
    read_at: string;
  }>;
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
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced mock implementation with more realistic data
  useEffect(() => {
    if (connectionId) {
      setIsLoading(true);
      setOnlineStatus('online');
      
      // Mock realistic message thread
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hey! Great to connect with you. I saw your profile and would love to discuss potential collaboration opportunities.',
          sender_id: connectionId,
          sender_name: 'John Doe',
          sender_avatar: '',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          type: 'text',
          reactions: { '👍': ['user1'], '❤️': ['user2', 'user3'] },
          read_by: [
            {
              user_id: user?.id || 'current_user',
              user_name: 'You',
              read_at: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        },
        {
          id: '2',
          content: 'That sounds interesting! I\'d be happy to explore opportunities. What kind of collaboration did you have in mind?',
          sender_id: user?.id || 'current_user',
          sender_name: 'You',
          timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 min ago
          type: 'text',
          reactions: {},
          read_by: [
            {
              user_id: connectionId,
              user_name: 'John Doe',
              read_at: new Date(Date.now() - 2700000).toISOString()
            }
          ]
        },
        {
          id: '3',
          content: 'I\'m working on a project that could benefit from your expertise in AI. Let me share the project brief with you.',
          sender_id: connectionId,
          sender_name: 'John Doe',
          timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 min ago
          type: 'file',
          file_url: 'https://example.com/project-brief.pdf',
          file_name: 'AI_Project_Brief_2024.pdf',
          reactions: { '🔥': ['user1'] },
          read_by: []
        }
      ];
      
      setMessages(mockMessages);
      setIsLoading(false);

      // Simulate typing users occasionally
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          setTypingUsers([{
            user_id: connectionId,
            user_name: 'John Doe',
            last_activity: new Date().toISOString()
          }]);
          
          setTimeout(() => setTypingUsers([]), 3000);
        }
      }, 10000);

      return () => clearInterval(typingInterval);
    }
  }, [connectionId, user]);

  const sendMessage = useCallback(async (params: {
    content: string;
    type: 'text' | 'file' | 'image';
    file_url?: string;
    file_name?: string;
    reply_to?: string;
  }) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: params.content,
      sender_id: user.id,
      sender_name: user.email || 'You',
      timestamp: new Date().toISOString(),
      type: params.type,
      file_url: params.file_url,
      file_name: params.file_name,
      reply_to: params.reply_to,
      reactions: {},
      read_by: []
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Simulate read receipt after a delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? {
              ...msg,
              read_by: [{
                user_id: connectionId,
                user_name: 'John Doe',
                read_at: new Date().toISOString()
              }]
            }
          : msg
      ));
    }, 2000);
  }, [user, connectionId]);

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    // Mock implementation - in real app this would send to WebSocket
    console.log('Typing indicator:', isTyping);
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    try {
      // Mock file upload with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
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
        const hasReacted = currentReactions.includes(user.id);
        
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reaction]: hasReacted 
              ? currentReactions.filter(id => id !== user.id)
              : [...currentReactions, user.id]
          }
        };
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

  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!user) return;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const readBy = msg.read_by || [];
        const alreadyRead = readBy.some(reader => reader.user_id === user.id);
        
        if (!alreadyRead) {
          return {
            ...msg,
            read_by: [
              ...readBy,
              {
                user_id: user.id,
                user_name: user.email || 'You',
                read_at: new Date().toISOString()
              }
            ]
          };
        }
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
    markMessageAsRead,
    typingUsers,
    onlineStatus,
    isLoading
  };
}
