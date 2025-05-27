
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '@/hooks/useRealtimeChat';
import { useAuth } from '@/hooks/useAuth';

interface OptimisticMessage extends Omit<ChatMessage, 'id'> {
  optimisticId: string;
  sending?: boolean;
  failed?: boolean;
}

export function useOptimisticMessages(connectionId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);

  const addOptimisticMessage = useCallback((content: string, type: 'text' | 'file' | 'image' = 'text', fileData?: { url: string; name: string }) => {
    if (!user) return null;

    const optimisticId = `optimistic_${Date.now()}_${Math.random()}`;
    const optimisticMessage: OptimisticMessage = {
      optimisticId,
      content,
      sender_id: user.id,
      sender_name: user.email || 'You',
      timestamp: new Date().toISOString(),
      type,
      file_url: fileData?.url,
      file_name: fileData?.name,
      reactions: {},
      sending: true
    };

    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    return optimisticId;
  }, [user]);

  const markMessageSent = useCallback((optimisticId: string, realMessage: ChatMessage) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.optimisticId !== optimisticId));
    
    // Update the real messages cache
    queryClient.setQueryData(['chat-messages', connectionId], (old: ChatMessage[] = []) => {
      return [...old, realMessage];
    });
  }, [connectionId, queryClient]);

  const markMessageFailed = useCallback((optimisticId: string) => {
    setOptimisticMessages(prev => 
      prev.map(msg => 
        msg.optimisticId === optimisticId 
          ? { ...msg, sending: false, failed: true }
          : msg
      )
    );
  }, []);

  const retryFailedMessage = useCallback((optimisticId: string) => {
    setOptimisticMessages(prev => 
      prev.map(msg => 
        msg.optimisticId === optimisticId 
          ? { ...msg, sending: true, failed: false }
          : msg
      )
    );
  }, []);

  const removeOptimisticMessage = useCallback((optimisticId: string) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.optimisticId !== optimisticId));
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    markMessageSent,
    markMessageFailed,
    retryFailedMessage,
    removeOptimisticMessage
  };
}
