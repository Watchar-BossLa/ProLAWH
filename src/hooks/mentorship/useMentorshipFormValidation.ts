
import { useState, useMemo } from 'react';
import { MentorshipRequest } from '@/types/network';

interface ValidationErrors {
  goals?: string;
  message?: string;
  duration?: string;
  focusAreas?: string;
}

export function useMentorshipFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (request: Partial<MentorshipRequest>): boolean => {
    const newErrors: ValidationErrors = {};

    if (!request.goals || request.goals.trim().length < 10) {
      newErrors.goals = 'Goals must be at least 10 characters long';
    }

    if (!request.message || request.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters long';
    }

    if (!request.duration) {
      newErrors.duration = 'Please select a duration';
    }

    if (!request.focusAreas || request.focusAreas.length === 0) {
      newErrors.focusAreas = 'Please select at least one focus area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const clearErrors = () => setErrors({});

  return {
    errors,
    isValid,
    validateForm,
    clearErrors
  };
}
