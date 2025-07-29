
import { SecurityEvent } from './types';
import { enterpriseSecurity } from './enterpriseSecurity';

class SecurityMonitoring {
  monitorSensitiveAccess(operation: string, context: any): void {
    const event: SecurityEvent = {
      type: 'data_access',
      severity: 'medium',
      description: `Sensitive operation: ${operation}`,
      context: {
        userId: context.userId,
        sessionId: context.sessionId,
        ipAddress: context.ipAddress || 'unknown',
        userAgent: context.userAgent || 'unknown',
        timestamp: new Date().toISOString(),
        riskScore: this.calculateRiskScore(context),
        flags: [`sensitive_access`, operation]
      },
      metadata: { operation }
    };

    enterpriseSecurity.logSecurityEvent(event);
  }

  private calculateRiskScore(context: any): number {
    let score = 1;
    
    if (!context.userId) score += 3;
    if (!context.ipAddress || context.ipAddress === 'unknown') score += 2;
    if (context.suspiciousActivity) score += 4;
    
    return Math.min(score, 10);
  }
}

export const securityMonitoring = new SecurityMonitoring();
