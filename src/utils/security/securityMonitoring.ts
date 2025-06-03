
import { SecurityEvent, SecurityContext } from './types';

export class SecurityMonitoringService {
  constructor(private onSecurityEvent: (event: SecurityEvent) => void) {}

  detectDOMTampering(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const tag = element.tagName?.toLowerCase();
              
              // Check for suspicious script injections
              if (tag === 'script' || tag === 'iframe') {
                this.onSecurityEvent({
                  type: 'injection_attempt',
                  severity: 'critical',
                  description: `Suspicious ${tag} element injected into DOM`,
                  context: this.createSecurityContext(),
                  metadata: { 
                    tagName: tag,
                    innerHTML: element.innerHTML?.substring(0, 200),
                    attributes: Array.from(element.attributes || []).map(attr => ({
                      name: attr.name,
                      value: attr.value
                    }))
                  }
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  monitorDataAccess(tableName: string, operation: string, recordCount: number): void {
    // Flag unusual data access patterns
    if (recordCount > 1000) {
      this.onSecurityEvent({
        type: 'data_access',
        severity: 'high',
        description: 'Large data access detected',
        context: this.createSecurityContext(),
        metadata: { tableName, operation, recordCount }
      });
    }

    if (operation === 'SELECT' && recordCount > 100) {
      this.onSecurityEvent({
        type: 'data_access',
        severity: 'medium',
        description: 'Bulk data read operation',
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
