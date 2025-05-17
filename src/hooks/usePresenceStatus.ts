
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

type PresenceStatus = 'online' | 'away' | 'offline';

interface PresenceState {
  status: PresenceStatus;
  lastActive?: string;
}

export function usePresenceStatus() {
  const [userStatuses, setUserStatuses] = useState<Record<string, PresenceState>>({});
  const { user } = useAuth();
  
  // Update user's own status
  const updateStatus = async (status: PresenceStatus) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          status,
          last_active: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error updating presence status:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Set initial status to online
    updateStatus('online');

    // Set up interval to update "last active" status to maintain online presence
    const intervalId = setInterval(() => {
      updateStatus('online');
    }, 30000); // Every 30 seconds
    
    // Subscribe to presence changes
    const channel = supabase
      .channel('presence_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          setUserStatuses(prev => ({
            ...prev,
            [payload.new.user_id]: {
              status: payload.new.status,
              lastActive: payload.new.last_active
            }
          }));
        }
      )
      .subscribe();

    // Fetch initial presence data
    const fetchPresenceData = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('*');
        
        if (error) throw error;
        
        const statuses: Record<string, PresenceState> = {};
        data.forEach(presence => {
          statuses[presence.user_id] = {
            status: presence.status as PresenceStatus,
            lastActive: presence.last_active
          };
        });
        
        setUserStatuses(statuses);
      } catch (error) {
        console.error('Error fetching presence data:', error);
      }
    };
    
    fetchPresenceData();
    
    // Handle window events to update status
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateStatus('online');
      } else {
        updateStatus('away');
      }
    };
    
    const handleBeforeUnload = () => {
      // Synchronous call as the page is about to unload
      navigator.sendBeacon(
        `${supabase.url}/rest/v1/user_presence`,
        JSON.stringify({
          user_id: user.id,
          status: 'offline',
          last_active: new Date().toISOString()
        })
      );
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateStatus('offline');
    };
  }, [user]);
  
  // Get a specific user's status
  const getUserStatus = (userId: string): PresenceState => {
    return userStatuses[userId] || { status: 'offline' };
  };
  
  return { 
    userStatuses, 
    getUserStatus,
    updateStatus
  };
}
