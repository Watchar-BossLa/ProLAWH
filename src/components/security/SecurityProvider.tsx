/**
 * Security Provider Component
 * Initializes security features and monitoring across the application
 */

import React, { useEffect, ReactNode } from 'react';
import { applySecurityHeaders } from '@/utils/security/securityHeaders';
import { tokenManager } from '@/utils/security/tokenSecurity';

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    // Apply security headers on mount
    applySecurityHeaders();
    
    // Set up token refresh monitoring
    const checkTokenHealth = () => {
      if (tokenManager.needsRefresh()) {
        tokenManager.refreshToken().catch(console.error);
      }
    };
    
    // Check token every 5 minutes
    const interval = setInterval(checkTokenHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}