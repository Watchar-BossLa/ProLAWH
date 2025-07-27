
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

type PresenceStatus = 'online' | 'away' | 'offline';

interface PresenceState {
  status: PresenceStatus;
  lastActive?: string;
  isTyping?: boolean;
  typingTo?: string | null;
}

interface PresencePayload {
  id: string;
  user_id: string;
  status: string;
  last_active: string;
  typing_to: string | null;
  created_at: string;
  updated_at: string;
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

  // Update typing status
  const updateTypingStatus = async (isTyping: boolean, recipientId: string | null = null) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          typing_to: isTyping ? recipientId : null,
          last_active: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error updating typing status:', error);
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
          const newData = payload.new as PresencePayload;
          
          setUserStatuses(prev => ({
            ...prev,
            [newData.user_id]: {
              status: newData.status as PresenceStatus,
              lastActive: newData.last_active,
              isTyping: !!newData.typing_to,
              typingTo: newData.typing_to
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
        data.forEach((presence: PresencePayload) => {
          statuses[presence.user_id] = {
            status: presence.status as PresenceStatus,
            lastActive: presence.last_active,
            isTyping: !!presence.typing_to,
            typingTo: presence.typing_to
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
      // Using fetch API with sendBeacon instead of directly accessing protected Supabase properties
      const apiUrl = `${window.location.protocol}//${window.location.host}/api/update-presence`;
      
      // Fallback to direct API URL if needed - using env variables or constants instead of accessing protected properties
      const fallbackApiUrl = "https://pynytoroxsqvfxybjeft.supabase.co/rest/v1/user_presence";
      const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnl0b3JveHNxdmZ4eWJqZWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjIwMjQsImV4cCI6MjA1ODUzODAyNH0.favQUuv9yeE3Xx-IxM6Hk5NHSqRf2Lb4DpA8cnbN9qQ";
      
      navigator.sendBeacon(
        fallbackApiUrl,
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
  
  // Check if user is typing to a specific recipient
  const isUserTypingTo = (userId: string, recipientId: string): boolean => {
    const status = userStatuses[userId];
    return !!status?.isTyping && status.typingTo === recipientId;
  };
  
  return { 
    userStatuses, 
    getUserStatus,
    updateStatus,
    updateTypingStatus,
    isUserTypingTo
  };
}
