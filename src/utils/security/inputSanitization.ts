/**
 * Input Sanitization Service
 */

export class InputSanitizationService {
  private logSecurityEvent: (event: any) => void;

  constructor(logger: (event: any) => void) {
    this.logSecurityEvent = logger;
  }

  // Sanitize user input to prevent XSS and injection attacks
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      this.logSecurityEvent({
        type: 'input_validation_failed',
        severity: 'medium',
        description: 'Non-string input received for sanitization',
        context: this.createSecurityContext(),
        metadata: { inputType: typeof input }
      });
      return '';
    }

    let sanitized = input;
    const originalLength = input.length;
    
    // Remove script tags
    sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    
    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    
    // Remove potentially dangerous HTML tags
    const dangerousTags = ['iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select'];
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    // Remove HTML comments that might contain malicious code
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
    
    // Encode remaining HTML entities for safety
    sanitized = this.encodeHTMLEntities(sanitized);
    
    // Log if significant sanitization occurred
    if (sanitized.length < originalLength * 0.8) {
      this.logSecurityEvent({
        type: 'input_validation_failed',
        severity: 'medium',
        description: 'Significant content removed during sanitization',
        context: this.createSecurityContext(),
        metadata: {
          originalLength,
          sanitizedLength: sanitized.length,
          reductionPercentage: Math.round(((originalLength - sanitized.length) / originalLength) * 100)
        }
      });
    }
    
    return sanitized;
  }

  // Encode HTML entities
  private encodeHTMLEntities(str: string): string {
    const entityMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'\/]/g, (char) => entityMap[char]);
  }

  private createSecurityContext() {
    return {
      timestamp: new Date().toISOString(),
      riskScore: 3,
      flags: []
    };
  }
}