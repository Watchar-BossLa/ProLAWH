import { useEffect, useCallback } from 'react';
import { enterpriseSecurity } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

export function useEnhancedSecurity() {
  // Enhanced input validation with security logging
  const validateAndSanitizeInput = useCallback((input: string, context: string = 'general') => {
    const sanitized = enterpriseSecurity.sanitizeInput(input);
    
    // Log if sanitization changed the input significantly
    if (sanitized !== input && input.length > 0) {
      enterpriseSecurity.logSecurityEvent({
        type: 'injection_attempt',
        severity: 'medium',
        description: `Input sanitization performed in ${context}`,
        context: {
          timestamp: new Date().toISOString(),
          riskScore: 3,
          flags: ['input_sanitization', context]
        },
        metadata: {
          originalLength: input.length,
          sanitizedLength: sanitized.length,
          context
        }
      });
    }
    
    return sanitized;
  }, []);

  // Monitor for suspicious activities
  const reportSuspiciousActivity = useCallback((activity: string, riskLevel: number = 5) => {
    enterpriseSecurity.logSecurityEvent({
      type: 'suspicious_activity',
      severity: riskLevel >= 7 ? 'high' : riskLevel >= 4 ? 'medium' : 'low',
      description: activity,
      context: {
        timestamp: new Date().toISOString(),
        riskScore: riskLevel,
        flags: ['user_reported', 'suspicious_activity']
      }
    });

    if (riskLevel >= 7) {
      toast({
        title: "Security Alert",
        description: "Suspicious activity has been logged and reported",
        variant: "destructive"
      });
    }
  }, []);

  // Enhanced rate limiting with security context
  const checkSecurityRateLimit = useCallback((operation: string, limit: number = 10, windowMs: number = 60000) => {
    const key = `security_${operation}`;
    const now = Date.now();
    
    // Simple in-memory rate limiting for demo
    const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= limit) {
      enterpriseSecurity.logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        description: `Rate limit exceeded for operation: ${operation}`,
        context: {
          timestamp: new Date().toISOString(),
          riskScore: 6,
          flags: ['rate_limit', operation]
        },
        metadata: { operation, attempts: validAttempts.length, limit }
      });
      
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many ${operation} attempts. Please wait before trying again.`,
        variant: "destructive"
      });
      
      return false;
    }
    
    validAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(validAttempts));
    return true;
  }, []);

  // Monitor user agent changes
  useEffect(() => {
    const userAgent = navigator.userAgent;
    enterpriseSecurity.detectAnomalousActivity(userAgent);
    
    // Store initial user agent
    const storedUA = localStorage.getItem('initial_user_agent');
    if (!storedUA) {
      localStorage.setItem('initial_user_agent', userAgent);
    } else if (storedUA !== userAgent) {
      enterpriseSecurity.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: 'User agent change detected',
        context: {
          timestamp: new Date().toISOString(),
          riskScore: 5,
          flags: ['user_agent_change']
        },
        metadata: { originalUA: storedUA, newUA: userAgent }
      });
    }
  }, []);

  // Monitor for console access (basic developer tools detection)
  useEffect(() => {
    let devtoolsOpen = false;
    const threshold = 160;
    
    const checkDevTools = () => {
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      
      if ((heightThreshold || widthThreshold) && !devtoolsOpen) {
        devtoolsOpen = true;
        enterpriseSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          description: 'Developer tools opened',
          context: {
            timestamp: new Date().toISOString(),
            riskScore: 2,
            flags: ['devtools_open']
          }
        });
      } else if (!heightThreshold && !widthThreshold && devtoolsOpen) {
        devtoolsOpen = false;
      }
    };
    
    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    validateAndSanitizeInput,
    reportSuspiciousActivity,
    checkSecurityRateLimit,
    getSecurityMetrics: enterpriseSecurity.getSecurityMetrics.bind(enterpriseSecurity),
    getSecurityLog: enterpriseSecurity.getSecurityLog.bind(enterpriseSecurity)
  };
}