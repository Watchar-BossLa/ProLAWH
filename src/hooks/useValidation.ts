
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateWithSchema } from '@/schemas/validation';

interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: Record<string, string>;
}

export function useValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((data: unknown): ValidationResult<T> => {
    const result = validateWithSchema(schema, data);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return {
        isValid: true,
        data: result.data,
        errors: {}
      };
    } else {
      const errorMap: Record<string, string> = {};
      result.errors?.forEach(error => {
        const [field, message] = error.split(': ');
        errorMap[field] = message;
      });
      
      setErrors(errorMap);
      setIsValid(false);
      return {
        isValid: false,
        errors: errorMap
      };
    }
  }, [schema]);

  const validateField = useCallback((fieldName: string, value: unknown) => {
    try {
      // Try to validate just this field
      const fieldSchema = (schema as any).shape?.[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || 'Invalid value';
        setErrors(prev => ({ ...prev, [fieldName]: message }));
      }
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName];
  }, [errors]);

  const hasFieldError = useCallback((fieldName: string) => {
    return Boolean(errors[fieldName]);
  }, [errors]);

  return {
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    errors,
    isValid,
    hasErrors: Object.keys(errors).length > 0
  };
}
