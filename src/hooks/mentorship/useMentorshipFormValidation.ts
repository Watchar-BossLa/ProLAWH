
import { useState, useMemo } from 'react';
import { MentorshipRequest } from '@/types/network';

export function useMentorshipFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (request: Partial<MentorshipRequest>): boolean => {
    const newErrors: Record<string, string> = {};

    if (!request.message || request.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    if (!request.focusAreas || request.focusAreas.length === 0) {
      newErrors.focusAreas = 'Please select at least one focus area';
    }

    if (!request.industry || request.industry.trim().length === 0) {
      newErrors.industry = 'Please select an industry';
    }

    if (!request.expectedDuration) {
      newErrors.expectedDuration = 'Please select a duration';
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
