
import { useCallback } from 'react';
import { RealTimeMessage, SendMessageParams } from '../types';
import { MessageService } from '../services/messageService';

interface UseMessageActionsProps {
  userId: string | undefined;
  currentRoom: string | null;
  messages: RealTimeMessage[];
  setMessages: (messages: RealTimeMessage[] | ((prev: RealTimeMessage[]) => RealTimeMessage[])) => void;
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
      type,
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

    const newReactions = await MessageService.addReaction(messageId, emoji, userId, message.reactions);
    
    if (newReactions) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: newReactions }
          : msg
      ));
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
