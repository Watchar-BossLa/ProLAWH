/**
 * Enhanced security headers configuration
 * Implements strengthened Content Security Policy and other protective headers
 */

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'nonce-{NONCE}' https://cdn.jsdelivr.net",
    "style-src 'self' 'nonce-{NONCE}' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()'
  ].join(', ')
};

/**
 * Generate a cryptographic nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Apply enhanced security headers to HTML document
 */
export function applySecurityHeaders(): void {
  const nonce = generateNonce();
  
  // Apply headers with nonce substitution
  Object.entries(SECURITY_HEADERS).forEach(([name, content]) => {
    const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      meta.setAttribute('content', content.replace(/{NONCE}/g, nonce));
      document.head.appendChild(meta);
    }
  });
  
  // Store nonce for script validation
  (window as any).__securityNonce = nonce;
}

/**
 * Validate current page security headers
 */
export function validateSecurityHeaders(): { isSecure: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for CSP
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!csp) {
    warnings.push('Content Security Policy not found');
  } else {
    const content = csp.getAttribute('content') || '';
    
    // Check for unsafe directives
    if (content.includes("'unsafe-inline'")) {
      warnings.push('CSP contains unsafe-inline directive');
    }
    if (content.includes("'unsafe-eval'")) {
      warnings.push('CSP contains unsafe-eval directive');
    }
  }
  
  // Check for X-Frame-Options
  const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!frameOptions) {
    warnings.push('X-Frame-Options not found');
  }
  
  // Check for other security headers
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Referrer-Policy'
  ];
  
  requiredHeaders.forEach(header => {
    if (!document.querySelector(`meta[http-equiv="${header}"]`)) {
      warnings.push(`${header} not found`);
    }
  });
  
  return {
    isSecure: warnings.length === 0,
    warnings
  };
}

/**
 * Validate script execution with nonce
 */
export function validateScriptNonce(scriptElement: HTMLScriptElement): boolean {
  const expectedNonce = (window as any).__securityNonce;
  const scriptNonce = scriptElement.getAttribute('nonce');
  
  if (!expectedNonce || !scriptNonce) {
    return false;
  }
  
  return scriptNonce === expectedNonce;
}