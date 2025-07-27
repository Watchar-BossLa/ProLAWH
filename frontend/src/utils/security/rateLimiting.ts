
import { SecurityEvent, SecurityContext } from './types';

export class RateLimitingService {
  private rateLimitStore = new Map<string, number[]>();

  constructor(private onSecurityEvent: (event: SecurityEvent) => void) {}

  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const window = this.rateLimitStore.get(key) || [];
    
    // Remove old entries
    const validEntries = window.filter(timestamp => now - timestamp < windowMs);
    
    if (validEntries.length >= maxRequests) {
      this.onSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        description: 'Rate limit exceeded',
        context: this.createSecurityContext(),
        metadata: { key, attempts: validEntries.length, maxRequests, windowMs }
      });
      return false;
    }

    validEntries.push(now);
    this.rateLimitStore.set(key, validEntries);
    return true;
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
