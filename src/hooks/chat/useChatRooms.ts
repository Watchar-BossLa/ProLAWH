
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ChatRoom } from './types';

export function useChatRooms() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatRooms = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

  return {
    chatRooms,
    isLoading,
    fetchChatRooms,
    createDirectChat
  };
}
