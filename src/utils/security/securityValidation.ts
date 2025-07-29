/**
 * Security Validation Service
 */

export class SecurityValidationService {
  private logSecurityEvent: (event: any) => void;

  constructor(logger: (event: any) => void) {
    this.logSecurityEvent = logger;
  }

  // Validate Content Security Policy
  validateCSP(): boolean {
    try {
      // Check if CSP is properly configured
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      
      if (metaTags.length === 0) {
        this.logSecurityEvent({
          type: 'csp_missing',
          severity: 'medium',
          description: 'Content Security Policy not configured',
          context: this.createSecurityContext(),
          metadata: { location: 'meta tags check' }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      this.logSecurityEvent({
        type: 'csp_missing',
        severity: 'low',
        description: 'Error validating CSP',
        context: this.createSecurityContext(),
        metadata: { error: error.message }
      });
      return false;
    }
  }

  // Validate session data integrity
  validateSession(sessionData: any): boolean {
    if (!sessionData) return false;
    
    try {
      // Check for required session fields
      const requiredFields = ['access_token', 'user', 'expires_at'];
      const hasAllFields = requiredFields.every(field => 
        sessionData.hasOwnProperty(field) && sessionData[field] !== null
      );
      
      if (!hasAllFields) {
        this.logSecurityEvent({
          type: 'session_validation_failed',
          severity: 'medium',
          description: 'Session missing required fields',
          context: this.createSecurityContext(),
          metadata: { 
            hasAccessToken: !!sessionData.access_token,
            hasUser: !!sessionData.user,
            hasExpiresAt: !!sessionData.expires_at
          }
        });
        return false;
      }
      
      // Check if session is expired
      const expiresAt = new Date(sessionData.expires_at);
      if (expiresAt < new Date()) {
        this.logSecurityEvent({
          type: 'session_validation_failed',
          severity: 'low',
          description: 'Session has expired',
          context: this.createSecurityContext(),
          metadata: { expiresAt: sessionData.expires_at }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      this.logSecurityEvent({
        type: 'session_validation_failed',
        severity: 'medium',
        description: 'Error validating session',
        context: this.createSecurityContext(),
        metadata: { error: error.message }
      });
      return false;
    }
  }

  // Validate security headers
  validateSecurityHeaders(): void {
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy'
    ];
    
    // Check if security headers are present in meta tags
    requiredHeaders.forEach(header => {
      const metaTag = document.querySelector(`meta[http-equiv="${header}"]`);
      if (!metaTag) {
        this.logSecurityEvent({
          type: 'security_header_missing',
          severity: 'medium',
          description: `Security header missing: ${header}`,
          context: this.createSecurityContext(),
          metadata: { header }
        });
      }
    });
  }

  private createSecurityContext() {
    return {
      timestamp: new Date().toISOString(),
      riskScore: 2,
      flags: []
    };
  }
}