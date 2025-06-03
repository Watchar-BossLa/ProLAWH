
import { enterpriseSecurity } from './enterpriseSecurity';

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
        context: {
          userId: undefined,
          sessionId: undefined,
          ipAddress: 'client-side',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          riskScore: 0,
          flags: []
        },
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
