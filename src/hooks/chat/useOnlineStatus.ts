
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useOnlineStatus(connectionId: string) {
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'away' | 'offline'>('offline');

  useEffect(() => {
    if (!connectionId) return;

    // Subscribe to online status
    const presenceChannel = supabase
      .channel(`presence:${connectionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const isOnline = Object.keys(state).length > 1;
        setOnlineStatus(isOnline ? 'online' : 'offline');
      })
      .subscribe();

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [connectionId]);

  return { onlineStatus };
}
