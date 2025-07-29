/**
 * Security Provider Component
 * Initializes security features and monitoring across the application
 */

import React, { useEffect, ReactNode } from 'react';
import { enterpriseSecurity } from '@/utils/security';

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    // Initialize enterprise security system
    enterpriseSecurity.initialize();
    
    // Apply comprehensive security headers
    const securityHeaders = [
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'X-XSS-Protection', content: '1; mode=block' }
    ];
    
    securityHeaders.forEach(header => {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', header.name);
      meta.setAttribute('content', header.content);
      document.head.appendChild(meta);
    });

    // Log security provider initialization
    enterpriseSecurity.logSecurityEvent({
      type: 'authentication',
      severity: 'low',
      description: 'Security provider initialized',
      context: {
        timestamp: new Date().toISOString(),
        riskScore: 0,
        flags: ['security_init']
      },
      metadata: { component: 'SecurityProvider' }
    });
    
    console.log('Enhanced security provider initialized');
  }, []);

  return <>{children}</>;
}