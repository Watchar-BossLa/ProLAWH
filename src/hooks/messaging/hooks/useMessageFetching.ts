
import { useState, useCallback } from 'react';
import { RealTimeMessage } from '../types';
import { MessageService } from '../services/messageService';

export function useMessageFetching(userId: string | undefined) {
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (roomId?: string, currentRoom?: string) => {
    if (!userId || (!roomId && !currentRoom)) return;

    const targetRoom = roomId || currentRoom;
    setIsLoading(true);
    setError(null);

    try {
      const fetchedMessages = await MessageService.fetchMessages(userId, targetRoom);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    fetchMessages
  };
}
