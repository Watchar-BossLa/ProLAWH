
import { enterpriseLogger } from './enterpriseLogging';

export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  riskScore: number;
  flags: string[];
}

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'rate_limit' | 'injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context: SecurityContext;
  metadata?: Record<string, any>;
}

class EnterpriseSecurity {
  private static instance: EnterpriseSecurity;
  private securityEvents: SecurityEvent[] = [];
  private rateLimitStore = new Map<string, number[]>();
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

  static getInstance(): EnterpriseSecurity {
    if (!EnterpriseSecurity.instance) {
      EnterpriseSecurity.instance = new EnterpriseSecurity();
    }
    return EnterpriseSecurity.instance;
  }

  // Input sanitization and validation
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      this.logSecurityEvent({
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
      this.logSecurityEvent({
        type: 'injection_attempt',
        severity: 'high',
        description: 'Suspicious pattern detected in input',
        context: this.createSecurityContext(),
        metadata: { originalInput: input, sanitizedInput: sanitized }
      });
    }

    return sanitized;
  }

  // Rate limiting
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const window = this.rateLimitStore.get(key) || [];
    
    // Remove old entries
    const validEntries = window.filter(timestamp => now - timestamp < windowMs);
    
    if (validEntries.length >= maxRequests) {
      this.logSecurityEvent({
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

  // Content Security Policy validation
  validateCSP(): boolean {
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaCSP) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: 'Content Security Policy not found',
        context: this.createSecurityContext()
      });
      return false;
    }
    return true;
  }

  // Check for suspicious DOM modifications
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
                this.logSecurityEvent({
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

  // Session security validation
  validateSession(sessionData: any): boolean {
    if (!sessionData) {
      this.logSecurityEvent({
        type: 'authentication',
        severity: 'medium',
        description: 'Invalid session data',
        context: this.createSecurityContext()
      });
      return false;
    }

    // Check session expiry
    if (sessionData.expires_at && new Date(sessionData.expires_at) < new Date()) {
      this.logSecurityEvent({
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

  // Detect potential data exfiltration
  monitorDataAccess(tableName: string, operation: string, recordCount: number): void {
    // Flag unusual data access patterns
    if (recordCount > 1000) {
      this.logSecurityEvent({
        type: 'data_access',
        severity: 'high',
        description: 'Large data access detected',
        context: this.createSecurityContext(),
        metadata: { tableName, operation, recordCount }
      });
    }

    if (operation === 'SELECT' && recordCount > 100) {
      this.logSecurityEvent({
        type: 'data_access',
        severity: 'medium',
        description: 'Bulk data read operation',
        context: this.createSecurityContext(),
        metadata: { tableName, operation, recordCount }
      });
    }
  }

  // Security headers validation
  validateSecurityHeaders(): void {
    const requiredHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];

    // This would typically be checked server-side, but we can check what's available
    requiredHeaders.forEach(header => {
      const metaTag = document.querySelector(`meta[http-equiv="${header}"]`);
      if (!metaTag) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          description: `Missing security header: ${header}`,
          context: this.createSecurityContext(),
          metadata: { missingHeader: header }
        });
      }
    });
  }

  // Create security context
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
    // This would integrate with your auth system
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

  private logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);
    
    // Log to enterprise logger
    enterpriseLogger.log({
      level: event.severity === 'critical' ? 'critical' : 
             event.severity === 'high' ? 'error' :
             event.severity === 'medium' ? 'warn' : 'info',
      message: `Security Event: ${event.description}`,
      component: 'EnterpriseSecurity',
      metadata: {
        securityEvent: event
      }
    });

    // Immediate action for critical events
    if (event.severity === 'critical') {
      this.handleCriticalSecurityEvent(event);
    }
  }

  private handleCriticalSecurityEvent(event: SecurityEvent): void {
    // In a real enterprise system, this would trigger immediate alerts
    console.error('CRITICAL SECURITY EVENT:', event);
    
    // Could trigger:
    // - Immediate session termination
    // - Account lockdown
    // - Admin notifications
    // - Incident response workflow
  }

  // Initialize security monitoring
  initialize(): void {
    this.validateCSP();
    this.validateSecurityHeaders();
    this.detectDOMTampering();
    
    enterpriseLogger.info('Enterprise security monitoring initialized', {}, 'EnterpriseSecurity');
  }

  // Get security metrics
  getSecurityMetrics(): {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    eventsByType: Record<string, number>;
    recentEvents: SecurityEvent[];
  } {
    const eventsBySeverity = this.securityEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByType = this.securityEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.securityEvents.length,
      eventsBySeverity,
      eventsByType,
      recentEvents: this.securityEvents.slice(-10)
    };
  }
}

// Export singleton instance
export const enterpriseSecurity = EnterpriseSecurity.getInstance();

// Security utilities
export const SecurityUtils = {
  // Password strength validation
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password must contain at least one number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one special character');

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  },

  // Email validation with security considerations
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      enterpriseSecurity.logSecurityEvent({
        type: 'authentication',
        severity: 'low',
        description: 'Invalid email format attempted',
        context: enterpriseSecurity['createSecurityContext'](),
        metadata: { email: email.substring(0, 10) + '...' }
      });
    }
    
    return isValid;
  },

  // Generate secure random tokens
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};
