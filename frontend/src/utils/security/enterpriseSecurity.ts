
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
    
    enterpriseLogger.info('Enterprise security monitoring initialized', {}, 'EnterpriseSecurity');
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
