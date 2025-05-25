
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TypingPresence } from './types';

export function useTypingIndicator(connectionId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!connectionId) return;

    // Subscribe to typing indicators with proper type handling
    const typingChannel = supabase
      .channel(`typing:${connectionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = typingChannel.presenceState();
        const typing = Object.keys(state).filter(key => {
          const presences = state[key] as TypingPresence[];
          return presences && presences.length > 0 && presences.some(p => p.typing === true);
        });
        setTypingUsers(typing);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const presences = newPresences as TypingPresence[];
        if (presences && presences.some(p => p.typing === true)) {
          setTypingUsers(prev => [...prev, key]);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setTypingUsers(prev => prev.filter(user => user !== key));
      })
      .subscribe();

    return () => {
      typingChannel.unsubscribe();
    };
  }, [connectionId]);

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel(`typing:${connectionId}`);
      
      if (isTyping) {
        await channel.track({ typing: true, user_id: user.id });
      } else {
        await channel.untrack();
      }
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [connectionId]);

  return { typingUsers, sendTypingIndicator };
}
