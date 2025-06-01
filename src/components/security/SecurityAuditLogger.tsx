
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'permission_denied' | 'suspicious_activity' | 'data_access' | 'role_change';
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  private eventQueue: SecurityEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  constructor() {
    // Flush events every 10 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 10000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });
  }

  async logEvent(event: Omit<SecurityEvent, 'timestamp' | 'ip_address' | 'user_agent'>) {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent
    };

    this.eventQueue.push(fullEvent);

    // Immediate flush for high/critical risk events
    if (event.risk_level === 'high' || event.risk_level === 'critical') {
      await this.flushEvents();
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // In production, you'd want to get this from your backend
      // For now, we'll use a placeholder
      return 'client-side';
    } catch (error) {
      return 'unknown';
    }
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return;

    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];

      const { error } = await supabase
        .from('security_audit_logs')
        .insert(events);

      if (error) {
        console.error('Failed to log security events:', error);
        // Put events back in queue for retry
        this.eventQueue.unshift(...events);
      }
    } catch (error) {
      console.error('Error flushing security events:', error);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
  }
}

// React hook for easy integration
export function useSecurityAuditLogger() {
  const { user } = useAuth();
  const logger = SecurityAuditLogger.getInstance();

  const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp' | 'ip_address' | 'user_agent' | 'user_id'>) => {
    logger.logEvent({
      ...event,
      user_id: user?.id
    });
  };

  const logLoginAttempt = (success: boolean, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: success ? 'login_success' : 'login_failure',
      risk_level: success ? 'low' : 'medium',
      metadata
    });
  };

  const logPermissionDenied = (resource: string, action: string) => {
    logSecurityEvent({
      event_type: 'permission_denied',
      risk_level: 'medium',
      metadata: { resource, action }
    });
  };

  const logSuspiciousActivity = (description: string, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'suspicious_activity',
      risk_level: 'high',
      metadata: { description, ...metadata }
    });
  };

  const logDataAccess = (table: string, operation: string, recordCount?: number) => {
    logSecurityEvent({
      event_type: 'data_access',
      risk_level: 'low',
      metadata: { table, operation, record_count: recordCount }
    });
  };

  useEffect(() => {
    return () => {
      logger.destroy();
    };
  }, []);

  return {
    logSecurityEvent,
    logLoginAttempt,
    logPermissionDenied,
    logSuspiciousActivity,
    logDataAccess
  };
}
