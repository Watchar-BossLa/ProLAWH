
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeSubscriptionProps {
  userId: string | undefined;
  currentRoom: string | null;
  fetchMessages: () => void;
}

export function useRealtimeSubscription({ 
  userId, 
  currentRoom, 
  fetchMessages 
}: UseRealtimeSubscriptionProps) {
  useEffect(() => {
    if (!userId || !currentRoom) return;

    const channel = supabase
      .channel(`messages:${currentRoom}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.connection_id === currentRoom || 
              newMessage.sender_id === userId || 
              newMessage.receiver_id === userId) {
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, currentRoom, fetchMessages]);
}
