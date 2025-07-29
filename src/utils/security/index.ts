
// Central security exports to avoid import conflicts
export { enterpriseSecurity } from './enterpriseSecurity';
export { rateLimiting } from './rateLimiting';
export { securityValidation } from './securityValidation';
export { securityMonitoring } from './securityMonitoring';
export { inputSanitization } from './inputSanitization';
export * from './types';

// Create a unified security utils class for easier access
export class SecurityUtils {
  static sanitizeInput(input: string): string {
    return enterpriseSecurity.sanitizeInput(input);
  }

  static validateSession(sessionData: any): boolean {
    return enterpriseSecurity.validateSession(sessionData);
  }

  static getSecurityMetrics() {
    return enterpriseSecurity.getSecurityMetrics();
  }

  static validateCSP(): boolean {
    return enterpriseSecurity.validateCSP();
  }

  static logSecurityEvent(event: any): void {
    enterpriseSecurity.logSecurityEvent(event);
  }
}

// For backward compatibility, create a securityEnhancements object
export const securityEnhancements = {
  sanitizeInput: SecurityUtils.sanitizeInput,
  validateSession: SecurityUtils.validateSession,
  getSecurityMetrics: SecurityUtils.getSecurityMetrics,
  validateCSP: SecurityUtils.validateCSP,
  logSecurityEvent: SecurityUtils.logSecurityEvent
};
