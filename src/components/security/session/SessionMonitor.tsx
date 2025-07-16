
import { useEffect } from 'react';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
import { useSessionManager } from '@/components/security/session/hooks/useSessionManager';
import { CONFIG } from '@/config';
import { toast } from '@/hooks/use-toast';

export function SessionMonitor() {
  const { user, session } = useEnterpriseAuth();
  const { sessions, revokeSession } = useSessionManager();

  // Monitor for concurrent sessions
  useEffect(() => {
    if (!user || !sessions.length) return;

    const maxSessions = CONFIG.SESSION?.MAX_SESSIONS_PER_USER || 5;
    
    if (sessions.length > maxSessions) {
      toast({
        title: "Multiple Sessions Detected",
        description: `You have ${sessions.length} active sessions. Consider revoking old sessions for security.`,
        variant: "destructive" // Changed from "warning" to "destructive"
      });
    }
  }, [sessions, user]);

  // Session expiry warning
  useEffect(() => {
    if (!session) return;

    const expiresAt = new Date(session.expires_at || 0).getTime();
    const now = Date.now();
    const timeToExpiry = expiresAt - now;
    
    // Warn 5 minutes before expiry
    const warningTime = 5 * 60 * 1000;
    
    if (timeToExpiry > 0 && timeToExpiry <= warningTime) {
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in a few minutes. Please save your work.",
        variant: "destructive" // Changed from "warning" to "destructive"
      });
    }
  }, [session]);

  return null; // This is a monitoring component with no UI
}
