
import { 
  SecurityEvent, 
  SecurityContext, 
  SecurityMetrics,
  SessionInfo
} from './types';

class EnterpriseSecurity {
  private initialized = false;
  private securityLog: SecurityEvent[] = [];

  initialize(): void {
    if (this.initialized) return;
    
    console.log('🔒 Enterprise Security System initialized');
    this.initialized = true;
  }

  logSecurityEvent(event: SecurityEvent): void {
    if (!this.initialized) {
      console.warn('Security system not initialized');
      return;
    }

    this.securityLog.push(event);
    
    // Log high-risk events to console
    if (event.context.riskScore >= 7) {
      console.warn('🚨 High-risk security event:', event);
    }
  }

  getSecurityLog(): SecurityEvent[] {
    return [...this.securityLog];
  }

  getSecurityMetrics(): SecurityMetrics {
    const eventsBySeverity = this.securityLog.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByType = this.securityLog.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.securityLog.length,
      eventsBySeverity,
      eventsByType,
      recentEvents: this.securityLog.slice(-10)
    };
  }

  validateSession(sessionData: any): boolean {
    try {
      if (!sessionData) return false;
      if (!sessionData.access_token) return false;
      if (!sessionData.user) return false;
      
      // Check token expiry
      if (sessionData.expires_at && new Date(sessionData.expires_at * 1000) < new Date()) {
        return false;
      }
      
      return true;
    } catch (error) {
      this.logSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Session validation error',
        context: this.createSecurityContext(5),
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  validateCSP(): boolean {
    try {
      // Check if CSP headers are present
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      const hasCSP = metaTags.length > 0;
      
      if (!hasCSP) {
        this.logSecurityEvent({
          type: 'system',
          severity: 'medium',
          description: 'Missing Content Security Policy',
          context: this.createSecurityContext(4)
        });
      }
      
      return hasCSP;
    } catch (error) {
      this.logSecurityEvent({
        type: 'system',
        severity: 'high',
        description: 'CSP validation error',
        context: this.createSecurityContext(6),
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;')
      .trim();
  }

  private createSecurityContext(riskScore: number = 0): SecurityContext {
    return {
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      ipAddress: 'client-side',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      riskScore,
      flags: []
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      return this.getSecureSessionData()?.user?.id;
    } catch {
      return undefined;
    }
  }

  private getCurrentSessionId(): string | undefined {
    try {
      return this.getSecureSessionData()?.access_token?.substring(0, 10);
    } catch {
      return undefined;
    }
  }

  private getSecureSessionData(): any {
    try {
      const sessionKey = Object.keys(localStorage).find(key => 
        key.startsWith('sb-') && key.includes('auth-token')
      );
      if (!sessionKey) return null;
      
      const sessionData = localStorage.getItem(sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      this.logSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Error accessing session data',
        context: this.createSecurityContext(3),
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return null;
    }
  }

  clearSecurityLog(): void {
    this.securityLog = [];
  }
}

export const enterpriseSecurity = new EnterpriseSecurity();
