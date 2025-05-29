
import { useState, useCallback } from 'react';
import { ChatMessage } from './chat/types';

export function useOptimisticMessages(initialMessages: ChatMessage[] = []) {
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  const addOptimisticMessage = useCallback((message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>) => {
    const optimisticMsg: ChatMessage = {
      ...message,
      id: `optimistic-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      reactions: [],
      sender_profile: {
        full_name: message.sender_name || 'Unknown'
      }
    };

    setOptimisticMessages(prev => [...prev, optimisticMsg]);
    return optimisticMsg.id;
  }, []);

  const removeOptimisticMessage = useCallback((optimisticId: string) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.id !== optimisticId));
  }, []);

  const updateOptimisticMessage = useCallback((optimisticId: string, realMessage: ChatMessage) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.id !== optimisticId));
  }, []);

  const allMessages = [...initialMessages, ...optimisticMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return {
    messages: allMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    updateOptimisticMessage,
    hasOptimisticMessages: optimisticMessages.length > 0
  };
}
