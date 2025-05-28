
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TypingUser {
  user_id: string;
  user_name?: string;
}

export function useTypingIndicator(chatId: string) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Subscribe to typing indicators
  useEffect(() => {
    if (!chatId) return;

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
          // Fetch current typing users
          const { data } = await supabase
            .from('typing_indicators')
            .select('user_id, is_typing')
            .eq('chat_id', chatId)
            .eq('is_typing', true)
            .neq('user_id', user?.id || ''); // Exclude current user

          if (data) {
            // Fetch user profiles separately
            const typingUsersWithNames = await Promise.all(
              data.map(async (item) => {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('full_name')
                  .eq('id', item.user_id)
                  .single();

                return {
                  user_id: item.user_id,
                  user_name: profile?.full_name || 'Unknown'
                };
              })
            );

            setTypingUsers(typingUsersWithNames);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!user) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          chat_id: chatId,
          user_id: user.id,
          is_typing: isTyping,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'chat_id,user_id'
        });

      // Auto-stop typing after 3 seconds
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          sendTypingIndicator(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [user, chatId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Stop typing indicator when leaving
      if (user) {
        supabase
          .from('typing_indicators')
          .upsert({
            chat_id: chatId,
            user_id: user.id,
            is_typing: false,
            last_activity: new Date().toISOString()
          }, {
            onConflict: 'chat_id,user_id'
          });
      }
    };
  }, [user, chatId]);

  return {
    typingUsers,
    sendTypingIndicator
  };
}
