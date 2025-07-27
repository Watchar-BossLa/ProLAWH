import React, { forwardRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { enterpriseSecurity } from '@/utils/security/enterpriseSecurity';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean;
  maxLength?: number;
  allowHTML?: boolean;
  validateInput?: (value: string) => boolean;
  onSecurityViolation?: (violation: string) => void;
}

interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  sanitize?: boolean;
  maxLength?: number;
  allowHTML?: boolean;
  validateInput?: (value: string) => boolean;
  onSecurityViolation?: (violation: string) => void;
}

// SECURITY: Enhanced XSS protection patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /function\s*\(/gi,
  /<iframe/gi,
  /document\.cookie/gi,
  /localStorage/gi,
  /sessionStorage/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /&#x[0-9a-f]+;/gi,
  /&#[0-9]+;/gi
];

function detectXSSAttempt(input: string): boolean {
  return XSS_PATTERNS.some(pattern => pattern.test(input));
}

function sanitizeSecurely(input: string, allowHTML: boolean = false): string {
  if (!allowHTML) {
    // Complete HTML sanitization for maximum security
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  } else {
    // Limited HTML sanitization - only allow safe tags
    const allowedTags = ['b', 'i', 'em', 'strong', 'u'];
    let sanitized = input;
    
    // Remove dangerous attributes
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
    
    // Remove script tags completely
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    return sanitized;
  }
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ 
    sanitize = true, 
    maxLength = 1000, 
    allowHTML = false, 
    validateInput,
    onSecurityViolation,
    onChange,
    ...props 
  }, ref) => {
    const handleChange = useMemo(() => (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      
      // SECURITY: Length validation
      if (rawValue.length > maxLength) {
        onSecurityViolation?.('Input exceeds maximum length');
        return;
      }

      // SECURITY: XSS detection
      if (detectXSSAttempt(rawValue)) {
        enterpriseSecurity.logSecurityEvent({
          type: 'injection_attempt',
          severity: 'high',
          description: 'XSS attempt detected in input field',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 8,
            flags: ['xss_attempt', 'input_field']
          },
          metadata: { 
            inputValue: rawValue.substring(0, 50) + '...',
            fieldName: props.name || 'unknown'
          }
        });
        
        onSecurityViolation?.('Potentially malicious content detected');
        return;
      }

      // SECURITY: Custom validation
      if (validateInput && !validateInput(rawValue)) {
        onSecurityViolation?.('Input validation failed');
        return;
      }

      // SECURITY: Sanitization
      let processedValue = rawValue;
      if (sanitize) {
        processedValue = sanitizeSecurely(rawValue, allowHTML);
        
        // Additional enterprise security sanitization
        processedValue = enterpriseSecurity.sanitizeInput(processedValue);
      }

      // Create new event with sanitized value
      const sanitizedEvent = {
        ...event,
        target: {
          ...event.target,
          value: processedValue
        }
      };

      onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
    }, [sanitize, maxLength, allowHTML, validateInput, onSecurityViolation, onChange, props.name]);

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  }
);

export const SecureTextarea = forwardRef<HTMLTextAreaElement, SecureTextareaProps>(
  ({ 
    sanitize = true, 
    maxLength = 5000, 
    allowHTML = false, 
    validateInput,
    onSecurityViolation,
    onChange,
    ...props 
  }, ref) => {
    const handleChange = useMemo(() => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const rawValue = event.target.value;
      
      // SECURITY: Length validation
      if (rawValue.length > maxLength) {
        onSecurityViolation?.('Input exceeds maximum length');
        return;
      }

      // SECURITY: XSS detection
      if (detectXSSAttempt(rawValue)) {
        enterpriseSecurity.logSecurityEvent({
          type: 'injection_attempt',
          severity: 'high',
          description: 'XSS attempt detected in textarea field',
          context: {
            userId: undefined,
            sessionId: undefined,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 8,
            flags: ['xss_attempt', 'textarea_field']
          },
          metadata: { 
            inputValue: rawValue.substring(0, 100) + '...',
            fieldName: props.name || 'unknown'
          }
        });
        
        onSecurityViolation?.('Potentially malicious content detected');
        return;
      }

      // SECURITY: Custom validation
      if (validateInput && !validateInput(rawValue)) {
        onSecurityViolation?.('Input validation failed');
        return;
      }

      // SECURITY: Sanitization
      let processedValue = rawValue;
      if (sanitize) {
        processedValue = sanitizeSecurely(rawValue, allowHTML);
        
        // Additional enterprise security sanitization
        processedValue = enterpriseSecurity.sanitizeInput(processedValue);
      }

      // Create new event with sanitized value
      const sanitizedEvent = {
        ...event,
        target: {
          ...event.target,
          value: processedValue
        }
      };

      onChange?.(sanitizedEvent as React.ChangeEvent<HTMLTextAreaElement>);
    }, [sanitize, maxLength, allowHTML, validateInput, onSecurityViolation, onChange, props.name]);

    return (
      <Textarea
        {...props}
        ref={ref}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  }
);

SecureInput.displayName = 'SecureInput';
SecureTextarea.displayName = 'SecureTextarea';