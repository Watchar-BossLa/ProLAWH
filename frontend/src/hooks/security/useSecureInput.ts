import { useState, useCallback } from 'react';
import { securityEnhancements } from '@/utils/security/securityEnhancements';

interface UseSecureInputOptions {
  type?: 'text' | 'email' | 'url' | 'number';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function useSecureInput(options: UseSecureInputOptions = {}) {
  const [value, setValue] = useState('');
  const [sanitizedValue, setSanitizedValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  const validateAndSet = useCallback((newValue: string) => {
    setValue(newValue);

    const validationErrors: string[] = [];

    // Basic validation
    if (options.required && !newValue.trim()) {
      validationErrors.push('This field is required');
    }

    if (options.minLength && newValue.length < options.minLength) {
      validationErrors.push(`Minimum length is ${options.minLength} characters`);
    }

    if (options.maxLength && newValue.length > options.maxLength) {
      validationErrors.push(`Maximum length is ${options.maxLength} characters`);
    }

    // Security validation
    const securityValidation = securityEnhancements.validateInput(
      newValue, 
      options.type || 'text'
    );

    if (!securityValidation.isValid) {
      validationErrors.push(...securityValidation.errors);
    }

    setSanitizedValue(securityValidation.sanitized);
    setErrors(validationErrors);
    setIsValid(validationErrors.length === 0);
  }, [options]);

  const clear = useCallback(() => {
    setValue('');
    setSanitizedValue('');
    setErrors([]);
    setIsValid(true);
  }, []);

  return {
    value,
    sanitizedValue,
    errors,
    isValid,
    setValue: validateAndSet,
    clear
  };
}