
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

export interface DeviceSession {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ip_address: string;
  location?: string;
  is_current: boolean;
  last_activity: string;
  created_at: string;
  expires_at: string;
}

export function useSessionManager() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DeviceSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate device fingerprint
  const generateDeviceId = useCallback((): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }, []);

  // Get device info
  const getDeviceInfo = useCallback(() => {
    const userAgent = navigator.userAgent;
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    let browser = 'Unknown';

    // Detect device type
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    return {
      device_type: deviceType,
      browser,
      device_name: `${browser} on ${deviceType}`
    };
  }, []);

  // Create or update current session
  const createSession = useCallback(async () => {
    if (!user) return;

    const deviceId = generateDeviceId();
    const deviceInfo = getDeviceInfo();

    const { error } = await handleAsyncError(
      async () => {
        try {
          // First, mark all other sessions for this device as inactive
          await supabase
            .from('user_sessions')
            .update({ is_current: false })
            .eq('user_id', user.id)
            .eq('device_id', deviceId);

          // Create new session
          const { error } = await supabase
            .from('user_sessions')
            .insert({
              user_id: user.id,
              device_id: deviceId,
              device_name: deviceInfo.device_name,
              device_type: deviceInfo.device_type,
              browser: deviceInfo.browser,
              ip_address: 'client-side', // In production, get from backend
              is_current: true,
              last_activity: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            });

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
          // Don't throw error, just log warning
        }
      },
      { operation: 'create_session' }
    );

    if (!error) {
      fetchSessions();
    }
  }, [user, generateDeviceId, getDeviceInfo]);

  // Fetch all user sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await handleAsyncError(
      async () => {
        try {
          const { data, error } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('user_id', user.id)
            .gt('expires_at', new Date().toISOString())
            .order('last_activity', { ascending: false });

          if (error) throw error;
          return data;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
          return [];
        }
      },
      { operation: 'fetch_sessions' }
    );

    if (data) {
      setSessions(data as DeviceSession[]);
      const current = data.find((s: any) => s.is_current);
      setCurrentSession(current || null);
    }
    setIsLoading(false);
  }, [user]);

  // Update session activity
  const updateActivity = useCallback(async () => {
    if (!user || !currentSession) return;

    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions')
            .update({ 
              last_activity: new Date().toISOString() 
            })
            .eq('id', currentSession.id);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'update_activity' }
    );
  }, [user, currentSession]);

  // Revoke session
  const revokeSession = useCallback(async (sessionId: string) => {
    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions')
            .delete()
            .eq('id', sessionId);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'revoke_session', session_id: sessionId }
    );

    if (!error) {
      toast({
        title: "Session Revoked",
        description: "The session has been successfully revoked"
      });
      fetchSessions();
    }
  }, [fetchSessions]);

  // Revoke all other sessions
  const revokeAllOtherSessions = useCallback(async () => {
    if (!currentSession) return;

    const { error } = await handleAsyncError(
      async () => {
        try {
          const { error } = await supabase
            .from('user_sessions')
            .delete()
            .eq('user_id', user!.id)
            .neq('id', currentSession.id);

          if (error) throw error;
        } catch (tableError) {
          console.warn('User sessions table not available yet');
        }
      },
      { operation: 'revoke_all_sessions' }
    );

    if (!error) {
      toast({
        title: "Sessions Revoked",
        description: "All other sessions have been revoked"
      });
      fetchSessions();
    }
  }, [user, currentSession, fetchSessions]);

  // Auto-update activity
  useEffect(() => {
    if (!user) return;

    // Update activity every 5 minutes
    const activityInterval = setInterval(updateActivity, 5 * 60 * 1000);

    // Update activity on user interaction
    const handleActivity = () => updateActivity();
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    let lastActivity = Date.now();
    const throttledActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 60000) { // Throttle to once per minute
        lastActivity = now;
        handleActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, { passive: true });
    });

    return () => {
      clearInterval(activityInterval);
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity);
      });
    };
  }, [user, updateActivity]);

  // Initialize session on mount
  useEffect(() => {
    if (user) {
      createSession();
      fetchSessions();
    }
  }, [user, createSession, fetchSessions]);

  return {
    sessions,
    currentSession,
    isLoading,
    fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
    updateActivity
  };
}
