import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TypingPresence } from './types';

export function useTypingIndicator() {
  const [typingUsers, setTypingUsers] = useState<TypingPresence[]>([]);

  const updateTypingStatus = useCallback(async (isTyping: boolean, chatId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !chatId) return;

      if (isTyping) {
        setTypingUsers(prev => {
          const existing = prev.find(t => t.user_id === user.id && t.chat_id === chatId);
          if (existing) return prev;
          
          return [...prev, {
            user_id: user.id,
            chat_id: chatId,
            is_typing: true,
            last_activity: new Date().toISOString(),
          }];
        });
      } else {
        setTypingUsers(prev => prev.filter(t => !(t.user_id === user.id && t.chat_id === chatId)));
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('typing_indicators')
      .on('presence', { event: 'sync' }, () => {
        // Handle typing status sync
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    typingUsers,
    updateTypingStatus
  };
}
