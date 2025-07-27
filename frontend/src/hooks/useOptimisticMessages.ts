
import { useState, useCallback } from 'react';
import { ChatMessage } from './chat/types';

export function useOptimisticMessages(initialMessages: ChatMessage[] = []) {
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  const addOptimisticMessage = useCallback((message: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const optimisticMsg: ChatMessage = {
      ...message,
      id: `optimistic-${Date.now()}`,
      created_at: now,
      updated_at: now,
      timestamp: now,
      reactions: [],
      read_receipts: [],
      is_edited: false,
      is_pinned: false,
      metadata: {},
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
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return {
    messages: allMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    updateOptimisticMessage,
    hasOptimisticMessages: optimisticMessages.length > 0
  };
}
