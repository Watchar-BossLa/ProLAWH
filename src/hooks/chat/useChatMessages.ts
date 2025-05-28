
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ChatMessage } from './types';

export function useChatMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    chatId: string,
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

  return {
    messages,
    isLoading,
    fetchMessages,
    sendMessage,
    markAsRead,
    setMessages
  };
}
