
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TypingIndicator } from './types';

export function useChatTyping() {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const updateTypingStatus = useCallback(async (isTyping: boolean, chatId?: string) => {
    if (!user || !chatId) return;

    try {
      if (isTyping) {
        // Upsert typing status
        await supabase
          .from('typing_indicators')
          .upsert({
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            last_activity: new Date().toISOString()
          }, {
            onConflict: 'chat_id,user_id'
          });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          updateTypingStatus(false, chatId);
        }, 3000);
      } else {
        // Remove typing status
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('chat_id', chatId)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [user]);

  const subscribeToTyping = useCallback((chatId: string) => {
    if (!user) return;

    const channel = supabase
      .channel(`typing_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          // Fetch current typing users for this chat
          const { data } = await supabase
            .from('typing_indicators')
            .select('*')
            .eq('chat_id', chatId)
            .eq('is_typing', true)
            .neq('user_id', user.id);

          // Transform data to match TypingIndicator interface
          const typingIndicators: TypingIndicator[] = (data || []).map(item => ({
            id: item.id || `${item.chat_id}-${item.user_id}`,
            chat_id: item.chat_id,
            user_id: item.user_id,
            is_typing: item.is_typing,
            last_activity: item.last_activity
          }));

          setTypingUsers(typingIndicators);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    typingUsers,
    updateTypingStatus,
    subscribeToTyping
  };
}
