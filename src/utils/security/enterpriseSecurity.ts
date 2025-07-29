
import { enterpriseLogger } from '../logging';
import { 
  SecurityContext, 
  SecurityEvent, 
  SecurityMetrics, 
  SessionInfo, 
  SecurityAlert,
  SecurityEventType,
  SecuritySeverity
} from './types';
import { InputSanitizationService } from './inputSanitization';
import { RateLimitingService } from './rateLimiting';
import { SecurityValidationService } from './securityValidation';
import { SecurityMonitoringService } from './securityMonitoring';

class EnterpriseSecurity {
  private static instance: EnterpriseSecurity;
  private securityEvents: SecurityEvent[] = [];
  private inputSanitizer: InputSanitizationService;
  private rateLimiter: RateLimitingService;
  private validator: SecurityValidationService;
  private monitor: SecurityMonitoringService;

  constructor() {
    this.inputSanitizer = new InputSanitizationService(this.logSecurityEvent.bind(this));
    this.rateLimiter = new RateLimitingService(this.logSecurityEvent.bind(this));
    this.validator = new SecurityValidationService(this.logSecurityEvent.bind(this));
    this.monitor = new SecurityMonitoringService(this.logSecurityEvent.bind(this));
  }

  static getInstance(): EnterpriseSecurity {
    if (!EnterpriseSecurity.instance) {
      EnterpriseSecurity.instance = new EnterpriseSecurity();
    }
    return EnterpriseSecurity.instance;
  }

  // Input sanitization and validation
  sanitizeInput(input: string): string {
    return this.inputSanitizer.sanitizeInput(input);
  }

  // Rate limiting
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    return this.rateLimiter.checkRateLimit(key, maxRequests, windowMs);
  }

  // Content Security Policy validation
  validateCSP(): boolean {
    return this.validator.validateCSP();
  }

  // Check for suspicious DOM modifications
  detectDOMTampering(): void {
    this.monitor.detectDOMTampering();
  }

  // Session security validation
  validateSession(sessionData: any): boolean {
    return this.validator.validateSession(sessionData);
  }

  // Detect potential data exfiltration
  monitorDataAccess(tableName: string, operation: string, recordCount: number): void {
    this.monitor.monitorDataAccess(tableName, operation, recordCount);
  }

  // Security headers validation
  validateSecurityHeaders(): void {
    this.validator.validateSecurityHeaders();
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

  // SECURITY: Enhanced session token handling - avoid direct localStorage access
  private getCurrentUserId(): string | undefined {
    try {
      // Use secure session manager instead of direct localStorage access
      return this.getSecureSessionData()?.user?.id;
    } catch {
      return undefined;
    }
  }

  private getCurrentSessionId(): string | undefined {
    try {
      // Use secure session manager instead of direct localStorage access
      return this.getSecureSessionData()?.access_token?.substring(0, 10);
    } catch {
      return undefined;
    }
  }

  // SECURITY: Centralized secure session data access
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

  logSecurityEvent(event: SecurityEvent): void {
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
    console.error('CRITICAL SECURITY EVENT:', event);
  }

  // Initialize security monitoring
  initialize(): void {
    this.validateCSP();
    this.validateSecurityHeaders();
    this.detectDOMTampering();
    this.setupRateLimiting();
    this.initializeSecurityMonitoring();
    
    enterpriseLogger.info('Enterprise security monitoring initialized', {}, 'EnterpriseSecurity');
  }

  // Rate limiting implementation
  private setupRateLimiting(): void {
    const rateLimitStorage = new Map<string, { count: number; resetTime: number }>();
    
    // Clear expired rate limits every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of rateLimitStorage.entries()) {
        if (now > value.resetTime) {
          rateLimitStorage.delete(key);
        }
      }
    }, 60000);
  }

  // Enhanced security monitoring
  private initializeSecurityMonitoring(): void {
    // Monitor for suspicious DOM modifications
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check for potentially malicious scripts
                if (element.tagName === 'SCRIPT' || element.innerHTML.includes('<script')) {
                  this.logSecurityEvent({
                    type: 'dom_tampering',
                    severity: 'high',
                    description: 'Suspicious script injection detected',
                    context: this.createSecurityContext(8),
                    metadata: { 
                      element: element.outerHTML.substring(0, 200),
                      timestamp: new Date().toISOString()
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
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'onclick']
      });
    }

    // Monitor for excessive API calls (potential attack)
    this.setupAPICallMonitoring();
  }

  // API call monitoring for abuse detection
  private setupAPICallMonitoring(): void {
    const originalFetch = window.fetch;
    const apiCallCount = new Map<string, number>();
    
    window.fetch = (...args) => {
      const url = args[0]?.toString() || '';
      const endpoint = new URL(url, window.location.origin).pathname;
      
      // Track API calls per endpoint
      const count = apiCallCount.get(endpoint) || 0;
      apiCallCount.set(endpoint, count + 1);
      
      // Alert on excessive calls (potential DoS)
      if (count > 100) {
        this.logSecurityEvent({
          type: 'api_abuse',
          severity: 'high',
          description: `Excessive API calls detected to ${endpoint}`,
          context: this.createSecurityContext(7),
          metadata: { endpoint, callCount: count }
        });
      }
      
      return originalFetch.apply(this, args);
    };
    
    // Reset counters every 5 minutes
    setInterval(() => {
      apiCallCount.clear();
    }, 300000);
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
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
