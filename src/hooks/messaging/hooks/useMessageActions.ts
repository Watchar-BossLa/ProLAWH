
import { useCallback } from 'react';
import { ChatMessage, SendMessageParams } from '@/hooks/chat/types';
import { MessageService } from '../services/messageService';

interface UseMessageActionsProps {
  userId: string | undefined;
  currentRoom: string | null;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  fetchMessages: () => void;
}

export function useMessageActions({ 
  userId, 
  currentRoom, 
  messages, 
  setMessages, 
  fetchMessages 
}: UseMessageActionsProps) {
  const sendMessage = useCallback(async (content: string, type: string = 'text', fileData?: any) => {
    if (!userId || !currentRoom) return;

    const params: SendMessageParams = {
      content,
      type: type as 'text' | 'file' | 'image' | 'video' | 'voice',
      ...(fileData && { fileData })
    };

    const success = await MessageService.sendMessage(userId, currentRoom, params);
    
    if (success) {
      fetchMessages();
    }
  }, [userId, currentRoom, fetchMessages]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!userId) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const success = await MessageService.addReaction(messageId, userId, emoji);
    
    if (success) {
      fetchMessages();
    }
  }, [userId, messages, setMessages]);

  const markAsRead = useCallback(async (messageId: string) => {
    if (!userId) return;

    try {
      console.log('Marking message as read:', messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [userId]);

  return {
    sendMessage,
    addReaction,
    markAsRead
  };
}
