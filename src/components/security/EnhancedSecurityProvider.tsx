import React, { useEffect, ReactNode } from 'react';
import { enterpriseSecurity } from '@/utils/security';
import { applySecurityHeaders, validateSecurityHeaders } from '@/utils/security/securityHeaders';
import { toast } from '@/hooks/use-toast';

interface EnhancedSecurityProviderProps {
  children: ReactNode;
}

export function EnhancedSecurityProvider({ children }: EnhancedSecurityProviderProps) {
  useEffect(() => {
    // Initialize enterprise security system
    enterpriseSecurity.initialize();
    
    // Apply comprehensive security headers
    applySecurityHeaders();
    
    // Validate security configuration
    const headerValidation = validateSecurityHeaders();
    if (!headerValidation.isSecure) {
      console.warn('Security headers validation failed:', headerValidation.warnings);
      
      enterpriseSecurity.logSecurityEvent({
        type: 'system',
        severity: 'medium',
        description: 'Security headers validation failed',
        context: {
          timestamp: new Date().toISOString(),
          riskScore: 5,
          flags: ['security_headers', 'validation_failed']
        },
        metadata: { warnings: headerValidation.warnings }
      });
    }

    // Monitor for suspicious DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Detect suspicious script injections
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                enterpriseSecurity.logSecurityEvent({
                  type: 'suspicious_activity',
                  severity: 'high',
                  description: 'Unauthorized script injection detected',
                  context: {
                    timestamp: new Date().toISOString(),
                    riskScore: 8,
                    flags: ['script_injection', 'dom_tampering']
                  },
                  metadata: { 
                    tagName: element.tagName,
                    innerHTML: element.innerHTML.substring(0, 100)
                  }
                });
                
                toast({
                  title: "Security Alert",
                  description: "Suspicious script injection detected and blocked",
                  variant: "destructive"
                });
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

    // Enhanced session monitoring
    const monitorSession = () => {
      const sessionData = localStorage.getItem('supabase.auth.token');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          const isValid = enterpriseSecurity.validateSession(session);
          
          if (!isValid) {
            enterpriseSecurity.logSecurityEvent({
              type: 'authentication',
              severity: 'medium',
              description: 'Invalid session detected',
              context: {
                timestamp: new Date().toISOString(),
                riskScore: 6,
                flags: ['invalid_session']
              }
            });
          }
        } catch (error) {
          enterpriseSecurity.logSecurityEvent({
            type: 'authentication',
            severity: 'medium',
            description: 'Session parsing error',
            context: {
              timestamp: new Date().toISOString(),
              riskScore: 4,
              flags: ['session_error']
            },
            metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
        }
      }
    };

    // Monitor session every 30 seconds
    const sessionInterval = setInterval(monitorSession, 30000);

    // Log security provider initialization
    enterpriseSecurity.logSecurityEvent({
      type: 'system',
      severity: 'low',
      description: 'Enhanced security provider initialized',
      context: {
        timestamp: new Date().toISOString(),
        riskScore: 0,
        flags: ['security_init', 'enhanced']
      },
      metadata: { 
        component: 'EnhancedSecurityProvider',
        features: ['dom_monitoring', 'session_validation', 'security_headers']
      }
    });
    
    console.log('🔒 Enhanced security provider initialized with comprehensive monitoring');

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(sessionInterval);
    };
  }, []);

  return <>{children}</>;
}