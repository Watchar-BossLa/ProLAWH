import { useEffect } from 'react';
import { enterpriseSecurity } from '@/utils/security';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
import { toast } from '@/hooks/use-toast';

/**
 * SECURITY FIX: Real-time security monitoring component
 * Detects and responds to security threats in real-time
 */
export function SecurityMonitor() {
  const { user } = useEnterpriseAuth();

  useEffect(() => {
    if (!user) return;

    // Initialize enterprise security monitoring
    enterpriseSecurity.initialize();

    // Monitor for XSS attempts
    const detectXSSAttempts = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Check for suspicious script injections
                if (element.tagName === 'SCRIPT') {
                  enterpriseSecurity.logSecurityEvent({
                    type: 'injection_attempt',
                    severity: 'critical',
                    description: 'Potential XSS attack detected - script injection',
                    context: {
                      userId: user.id,
                      sessionId: undefined,
                      ipAddress: 'client-side',
                      userAgent: navigator.userAgent,
                      timestamp: new Date().toISOString(),
                      riskScore: 9,
                      flags: ['xss_attempt', 'script_injection']
                    },
                    metadata: {
                      scriptContent: element.textContent?.substring(0, 100),
                      insertionMethod: 'dom_manipulation'
                    }
                  });

                  // Remove the malicious script
                  element.remove();

                  toast({
                    title: "Security Alert",
                    description: "Potential XSS attempt blocked. Security team has been notified.",
                    variant: "destructive"
                  });
                }

                // Check for suspicious iframe injections
                if (element.tagName === 'IFRAME') {
                  const src = element.getAttribute('src');
                  if (src && !src.startsWith(window.location.origin)) {
                    enterpriseSecurity.logSecurityEvent({
                      type: 'injection_attempt',
                      severity: 'high',
                      description: 'Suspicious iframe injection detected',
                      context: {
                        userId: user.id,
                        sessionId: undefined,
                        ipAddress: 'client-side',
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString(),
                        riskScore: 7,
                        flags: ['iframe_injection', 'external_content']
                      },
                      metadata: {
                        iframeSrc: src,
                        insertionMethod: 'dom_manipulation'
                      }
                    });

                    element.remove();
                  }
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    };

    // Monitor for suspicious network activity
    const monitorNetworkActivity = () => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = args[0] as string;
        
        // Check for suspicious external requests
        if (typeof url === 'string' && !url.startsWith(window.location.origin) && !url.startsWith('/')) {
          // Allow known safe domains (Supabase, etc.)
          const safeDomains = [
            'supabase.co',
            'supabase.com',
            'lovableproject.com'
          ];
          
          const urlObj = new URL(url);
          const isSafeDomain = safeDomains.some(domain => urlObj.hostname.includes(domain));
          
          if (!isSafeDomain) {
            enterpriseSecurity.logSecurityEvent({
              type: 'suspicious_activity',
              severity: 'medium',
              description: 'Suspicious external network request detected',
              context: {
                userId: user.id,
                sessionId: undefined,
                ipAddress: 'client-side',
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                riskScore: 5,
                flags: ['external_request', 'data_exfiltration_risk']
              },
              metadata: {
                requestUrl: url,
                requestMethod: args[1]?.method || 'GET'
              }
            });
          }
        }
        
        return originalFetch.apply(window, args);
      };

      return () => {
        window.fetch = originalFetch;
      };
    };

    // Monitor for console manipulation attempts
    const monitorConsoleAccess = () => {
      const originalConsole = { ...console };
      
      // Override console methods to detect malicious usage
      ['log', 'warn', 'error', 'debug'].forEach(method => {
        (console as any)[method] = (...args: any[]) => {
          const message = args.join(' ');
          
          // Check for suspicious console commands
          const suspiciousPatterns = [
            /document\.cookie/i,
            /localStorage/i,
            /sessionStorage/i,
            /eval\(/i,
            /Function\(/i,
            /\.innerHTML/i
          ];
          
          if (suspiciousPatterns.some(pattern => pattern.test(message))) {
            enterpriseSecurity.logSecurityEvent({
              type: 'suspicious_activity',
              severity: 'medium',
              description: 'Suspicious console activity detected',
              context: {
                userId: user.id,
                sessionId: undefined,
                ipAddress: 'client-side',
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                riskScore: 4,
                flags: ['console_manipulation', 'potential_attack']
              },
              metadata: {
                consoleMessage: message.substring(0, 200),
                consoleMethod: method
              }
            });
          }
          
          // Call original console method
          (originalConsole as any)[method].apply(console, args);
        };
      });

      return () => {
        Object.assign(console, originalConsole);
      };
    };

    // Start all monitoring
    const cleanupXSS = detectXSSAttempts();
    const cleanupNetwork = monitorNetworkActivity();
    const cleanupConsole = monitorConsoleAccess();

    // Cleanup on unmount
    return () => {
      cleanupXSS();
      cleanupNetwork();
      cleanupConsole();
    };
  }, [user]);

  // Component renders nothing - it's purely for monitoring
  return null;
}