
import { SecurityEvent } from './types';

class EnterpriseSecurity {
  private initialized = false;
  private securityLog: SecurityEvent[] = [];

  initialize(): void {
    if (this.initialized) return;
    
    console.log('🔒 Enterprise Security System initialized');
    this.initialized = true;
  }

  logSecurityEvent(event: SecurityEvent): void {
    if (!this.initialized) {
      console.warn('Security system not initialized');
      return;
    }

    this.securityLog.push(event);
    
    // Log high-risk events to console
    if (event.context.riskScore >= 7) {
      console.warn('🚨 High-risk security event:', event);
    }
  }

  getSecurityLog(): SecurityEvent[] {
    return [...this.securityLog];
  }

  clearSecurityLog(): void {
    this.securityLog = [];
  }
}

export const enterpriseSecurity = new EnterpriseSecurity();
