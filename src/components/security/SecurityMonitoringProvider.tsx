import React, { useEffect, ReactNode } from 'react';
import { enterpriseSecurity } from '@/utils/security/enterpriseSecurity';
import { enhancedTokenManager } from '@/utils/security/enhancedTokenSecurity';
import { applySecurityHeaders } from '@/utils/security/securityHeaders';
import { toast } from '@/hooks/use-toast';

interface SecurityMonitoringProviderProps {
  children: ReactNode;
}

export function SecurityMonitoringProvider({ children }: SecurityMonitoringProviderProps) {
  useEffect(() => {
    // Initialize security systems
    enterpriseSecurity.initialize();
    applySecurityHeaders();

    // Set up continuous security monitoring
    const securityInterval = setInterval(() => {
      // Check for token validity
      const token = enhancedTokenManager.getToken();
      if (token && enhancedTokenManager.needsRefresh()) {
        enhancedTokenManager.refreshToken().catch(error => {
          console.error('Token refresh failed:', error);
          enterpriseSecurity.logSecurityEvent({
            type: 'authentication',
            severity: 'medium',
            description: 'Automatic token refresh failed',
            context: {
              userId: undefined,
              sessionId: token.sessionId,
              ipAddress: 'client-side',
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              riskScore: 5,
              flags: ['token_refresh_failed']
            }
          });
        });
      }

      // Monitor for suspicious activity patterns
      const metrics = enterpriseSecurity.getSecurityMetrics();
      const recentHighRiskEvents = metrics.recentEvents.filter(
        event => event.context.riskScore >= 7
      );

      if (recentHighRiskEvents.length >= 3) {
        toast({
          title: "Security Alert",
          description: "Multiple high-risk security events detected. Please review your account security.",
          variant: "destructive"
        });
        
        enterpriseSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'critical',
          description: 'Multiple high-risk events pattern detected',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 10,
            flags: ['pattern_detection', 'multiple_high_risk']
          },
          metadata: { eventCount: recentHighRiskEvents.length }
        });
      }
    }, 30000); // Check every 30 seconds

    // Monitor for tab visibility changes (potential session hijacking)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        enterpriseSecurity.logSecurityEvent({
          type: 'system',
          severity: 'low',
          description: 'Tab became hidden',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 1,
            flags: ['tab_hidden']
          }
        });
      } else {
        // Check for potential session tampering when tab becomes visible
        const token = enhancedTokenManager.getToken();
        if (token) {
          enterpriseSecurity.logSecurityEvent({
            type: 'authentication',
            severity: 'low',
            description: 'Session validated on tab focus',
            context: {
              userId: undefined,
              sessionId: token.sessionId,
              ipAddress: 'client-side',
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              riskScore: 1,
              flags: ['tab_focus', 'session_check']
            }
          });
        }
      }
    };

    // Monitor for potential clickjacking
    const handleClick = (event: MouseEvent) => {
      // Check if click is on a suspicious element
      const target = event.target as Element;
      if (target && (
        target.tagName === 'IFRAME' ||
        target.classList.contains('suspicious') ||
        target.hasAttribute('data-suspicious')
      )) {
        enterpriseSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Click on potentially suspicious element',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 6,
            flags: ['suspicious_click', 'potential_clickjacking']
          },
          metadata: {
            tagName: target.tagName,
            className: target.className,
            id: target.id
          }
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleClick, true);

    // Monitor for console access (developer tools)
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      
      if ((heightThreshold || widthThreshold) && !devToolsOpen) {
        devToolsOpen = true;
        enterpriseSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          description: 'Developer tools opened',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 2,
            flags: ['devtools_open']
          }
        });
      } else if (!heightThreshold && !widthThreshold && devToolsOpen) {
        devToolsOpen = false;
      }
    };

    const devToolsInterval = setInterval(detectDevTools, 1000);

    console.log('🛡️ Enhanced security monitoring initialized');

    // Cleanup
    return () => {
      clearInterval(securityInterval);
      clearInterval(devToolsInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return <>{children}</>;
}