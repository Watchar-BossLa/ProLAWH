
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { DeviceSession } from '../types';
import { generateDeviceId, getDeviceInfo } from '../utils/deviceFingerprint';
import { SessionService } from '../services/sessionService';

export function useSessionManager() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<DeviceSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create or update current session
  const createSession = useCallback(async () => {
    if (!user) return;

    const deviceId = generateDeviceId();
    const deviceInfo = getDeviceInfo();

    const { error } = await SessionService.createSession(user.id, deviceId, deviceInfo);

    if (!error) {
      fetchSessions();
    }
  }, [user]);

  // Fetch all user sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await SessionService.fetchSessions(user.id);

    if (data && !error) {
      setSessions(data);
      const current = data.find((s: DeviceSession) => s.is_current);
      setCurrentSession(current || null);
    }
    setIsLoading(false);
  }, [user]);

  // Update session activity
  const updateActivity = useCallback(async () => {
    if (!user || !currentSession) return;

    await SessionService.updateActivity(currentSession.id);
  }, [user, currentSession]);

  // Revoke session
  const revokeSession = useCallback(async (sessionId: string) => {
    const { error } = await SessionService.revokeSession(sessionId);

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
    if (!currentSession || !user) return;

    const { error } = await SessionService.revokeAllOtherSessions(user.id, currentSession.id);

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
