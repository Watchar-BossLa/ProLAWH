
import { useState } from 'react';
import { MentorshipRequest } from '@/types/network';

export function useMentorshipFormState() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (
    request: MentorshipRequest,
    onSubmit: (request: MentorshipRequest) => void | Promise<void>
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await onSubmit(request);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setSubmitError(null);

  return {
    isSubmitting,
    submitError,
    handleSubmit,
    resetError
  };
}
