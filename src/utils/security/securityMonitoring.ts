
import { SecurityEvent, SecurityContext } from './types';

export class SecurityMonitoringService {
  constructor(private onSecurityEvent: (event: SecurityEvent) => void) {}

  detectDOMTampering(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const suspiciousNodes = Array.from(mutation.addedNodes).filter((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.tagName === 'SCRIPT' || element.tagName === 'IFRAME';
            }
            return false;
          });

          if (suspiciousNodes.length > 0) {
            this.onSecurityEvent({
              type: 'suspicious_activity',
              severity: 'high',
              description: 'Suspicious DOM modification detected',
              context: this.createSecurityContext(),
              metadata: { nodeCount: suspiciousNodes.length }
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  monitorDataAccess(tableName: string, operation: string, recordCount: number): void {
    if (recordCount > 1000) {
      this.onSecurityEvent({
        type: 'data_access',
        severity: 'medium',
        description: 'Large data access detected',
        context: this.createSecurityContext(),
        metadata: { tableName, operation, recordCount }
      });
    }
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
