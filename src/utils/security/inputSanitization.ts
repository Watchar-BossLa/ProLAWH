
import { SecurityEvent, SecurityContext } from './types';

export class InputSanitizationService {
  private suspiciousPatterns = [
    /script\s*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /function\s*\(/i,
    /<iframe/i,
    /document\.cookie/i,
    /localStorage/i,
    /sessionStorage/i
  ];

  constructor(private onSecurityEvent: (event: SecurityEvent) => void) {}

  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      this.onSecurityEvent({
        type: 'injection_attempt',
        severity: 'medium',
        description: 'Non-string input detected',
        context: this.createSecurityContext(),
        metadata: { inputType: typeof input }
      });
      return '';
    }

    // Basic XSS prevention
    let sanitized = input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    // Check for suspicious patterns
    const suspiciousDetected = this.suspiciousPatterns.some(pattern => pattern.test(input));
    if (suspiciousDetected) {
      this.onSecurityEvent({
        type: 'injection_attempt',
        severity: 'high',
        description: 'Suspicious pattern detected in input',
        context: this.createSecurityContext(),
        metadata: { originalInput: input, sanitizedInput: sanitized }
      });
    }

    return sanitized;
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
