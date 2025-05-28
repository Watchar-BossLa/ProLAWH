
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TypingIndicator } from './types';

export function useChatTyping() {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  const updateTypingStatus = useCallback(async (isTyping: boolean, chatId?: string) => {
    if (!user || !chatId) return;

    try {
      // Mock implementation
      if (isTyping) {
        setTypingUsers(prev => {
          const existing = prev.find(t => t.user_id === user.id && t.chat_id === chatId);
          if (existing) return prev;
          
          return [...prev, {
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            last_activity: new Date().toISOString(),
            user_profile: {
              full_name: user.user_metadata?.full_name || 'You'
            }
          }];
        });
      } else {
        setTypingUsers(prev => prev.filter(t => !(t.user_id === user.id && t.chat_id === chatId)));
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [user]);

  return {
    typingUsers,
    updateTypingStatus
  };
}
