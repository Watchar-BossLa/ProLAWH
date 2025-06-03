
import { SecurityEvent, SecurityContext } from './types';

export class SecurityValidationService {
  constructor(private onSecurityEvent: (event: SecurityEvent) => void) {}

  validateCSP(): boolean {
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaCSP) {
      this.onSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: 'Content Security Policy not found',
        context: this.createSecurityContext()
      });
      return false;
    }
    return true;
  }

  validateSession(sessionData: any): boolean {
    if (!sessionData) {
      this.onSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Invalid session data',
        context: this.createSecurityContext()
      });
      return false;
    }

    // Check session expiry
    if (sessionData.expires_at && new Date(sessionData.expires_at) < new Date()) {
      this.onSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Expired session detected',
        context: this.createSecurityContext(),
        metadata: { expiresAt: sessionData.expires_at }
      });
      return false;
    }

    return true;
  }

  validateSecurityHeaders(): void {
    const requiredHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];

    requiredHeaders.forEach(header => {
      const metaTag = document.querySelector(`meta[http-equiv="${header}"]`);
      if (!metaTag) {
        this.onSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          description: `Missing security header: ${header}`,
          context: this.createSecurityContext(),
          metadata: { missingHeader: header }
        });
      }
    });
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
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      return session.user?.id;
    } catch {
      return undefined;
    }
  }

  private getCurrentSessionId(): string | undefined {
    try {
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      return session.access_token?.substring(0, 10);
    } catch {
      return undefined;
    }
  }
}
