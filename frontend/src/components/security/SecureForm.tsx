import React, { useEffect, useState } from 'react';
import { securityEnhancements } from '@/utils/security/securityEnhancements';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
  className?: string;
}

export function SecureForm({ children, onSubmit, className }: SecureFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Generate CSRF token on mount
    const token = securityEnhancements.generateCSRFToken();
    setCsrfToken(token);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const formData = new FormData(e.currentTarget);
    const submittedToken = formData.get('csrf_token') as string;

    // Validate CSRF token
    if (!securityEnhancements.validateCSRFToken(submittedToken)) {
      setErrors(['Security token validation failed. Please refresh and try again.']);
      return;
    }

    // Validate session security
    if (!securityEnhancements.validateSessionSecurity()) {
      setErrors(['Session security validation failed. Please log in again.']);
      return;
    }

    // Validate all form inputs
    const formErrors: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'csrf_token') continue;
      
      if (typeof value === 'string') {
        const validation = securityEnhancements.validateInput(value, 'text');
        if (!validation.isValid) {
          formErrors.push(`${key}: ${validation.errors.join(', ')}`);
        }
        // Update form data with sanitized value
        formData.set(key, validation.sanitized);
      }
    }

    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* CSRF Token */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Security Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {children}
    </form>
  );
}