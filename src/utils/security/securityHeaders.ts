/**
 * Security headers configuration
 * Implements Content Security Policy and other protective headers
 */

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
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
 * Apply security headers to HTML document
 */
export function applySecurityHeaders(): void {
  // Add meta tags for security headers
  Object.entries(SECURITY_HEADERS).forEach(([name, content]) => {
    const existingMeta = document.querySelector(`meta[http-equiv="${name}"]`);
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  });
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
  }
  
  // Check for X-Frame-Options
  const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (!frameOptions) {
    warnings.push('X-Frame-Options not found');
  }
  
  return {
    isSecure: warnings.length === 0,
    warnings
  };
}