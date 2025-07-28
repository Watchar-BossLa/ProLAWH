import { SecurityEvent, SecurityContext } from './types';

export class SecurityEnhancementService {
  private static instance: SecurityEnhancementService;
  
  static getInstance(): SecurityEnhancementService {
    if (!SecurityEnhancementService.instance) {
      SecurityEnhancementService.instance = new SecurityEnhancementService();
    }
    return SecurityEnhancementService.instance;
  }

  // Enhanced XSS protection with comprehensive sanitization
  sanitizeHTML(input: string): string {
    if (typeof input !== 'string') {
      this.logSecurityEvent({
        type: 'injection_attempt',
        severity: 'medium',
        description: 'Non-string input to HTML sanitizer',
        context: this.createSecurityContext(),
        metadata: { inputType: typeof input }
      });
      return '';
    }

    // Remove all HTML tags and decode entities
    const withoutTags = input
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&amp;/g, '&'); // Decode entities

    // Re-encode for safe display
    return withoutTags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validate and sanitize user inputs
  validateInput(input: string, type: 'text' | 'email' | 'url' | 'number'): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = this.sanitizeHTML(input);

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          errors.push('Invalid email format');
        }
        break;
      
      case 'url':
        try {
          new URL(sanitized);
        } catch {
          errors.push('Invalid URL format');
        }
        break;
      
      case 'number':
        if (isNaN(Number(sanitized))) {
          errors.push('Invalid number format');
        }
        break;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i
    ];

    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(input));
    if (hasSuspiciousPattern) {
      this.logSecurityEvent({
        type: 'injection_attempt',
        severity: 'high',
        description: 'Suspicious pattern detected in input',
        context: this.createSecurityContext(),
        metadata: { input, type }
      });
      errors.push('Potentially malicious content detected');
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  // CSRF token generation and validation
  generateCSRFToken(): string {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Store in session storage with timestamp
    sessionStorage.setItem('csrf_token', JSON.stringify({
      token,
      timestamp: Date.now()
    }));
    
    return token;
  }

  validateCSRFToken(token: string): boolean {
    try {
      const stored = sessionStorage.getItem('csrf_token');
      if (!stored) return false;
      
      const { token: storedToken, timestamp } = JSON.parse(stored);
      
      // Token expires after 1 hour
      if (Date.now() - timestamp > 3600000) {
        sessionStorage.removeItem('csrf_token');
        return false;
      }
      
      return token === storedToken;
    } catch {
      return false;
    }
  }

  // Enhanced session validation
  validateSessionSecurity(): boolean {
    try {
      // Check for session hijacking indicators
      const userAgent = navigator.userAgent;
      const storedUserAgent = sessionStorage.getItem('session_user_agent');
      
      if (storedUserAgent && storedUserAgent !== userAgent) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'critical',
          description: 'User agent mismatch detected',
          context: this.createSecurityContext(),
          metadata: { stored: storedUserAgent, current: userAgent }
        });
        return false;
      }
      
      if (!storedUserAgent) {
        sessionStorage.setItem('session_user_agent', userAgent);
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Password strength validation
  validatePasswordStrength(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Password must contain numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Password must contain special characters');

    // Common password check
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('Password contains common patterns');
    }

    return {
      isValid: score >= 4,
      score: Math.min(5, score),
      feedback
    };
  }

  private logSecurityEvent(event: SecurityEvent): void {
    console.warn('Security Event:', event);
  }

  private createSecurityContext(): SecurityContext {
    return {
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      ipAddress: 'client-side',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      riskScore: 0,
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

export const securityEnhancements = SecurityEnhancementService.getInstance();