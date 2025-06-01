
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface StudyBeeError {
  type: 'network' | 'validation' | 'auth' | 'rate_limit' | 'unknown';
  message: string;
  details?: any;
  retryable?: boolean;
}

export function useStudyBeeErrorHandler() {
  const [lastError, setLastError] = useState<StudyBeeError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error: any, context?: string): StudyBeeError => {
    let studyBeeError: StudyBeeError;

    // Network errors
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      studyBeeError = {
        type: 'network',
        message: 'Connection to Study Bee failed. Please check your internet connection.',
        retryable: true
      };
    }
    // Rate limiting
    else if (error.status === 429) {
      studyBeeError = {
        type: 'rate_limit',
        message: 'Too many requests. Please wait a moment before trying again.',
        retryable: true
      };
    }
    // Authentication errors
    else if (error.status === 401 || error.status === 403) {
      studyBeeError = {
        type: 'auth',
        message: 'Authentication failed. Please reconnect to Study Bee.',
        retryable: false
      };
    }
    // Validation errors
    else if (error.status === 400) {
      studyBeeError = {
        type: 'validation',
        message: 'Invalid data received from Study Bee.',
        details: error.data,
        retryable: false
      };
    }
    // Unknown errors
    else {
      studyBeeError = {
        type: 'unknown',
        message: error.message || 'An unexpected error occurred.',
        details: error,
        retryable: true
      };
    }

    console.error(`Study Bee Error [${context || 'unknown'}]:`, studyBeeError);
    setLastError(studyBeeError);

    // Show user-friendly toast
    if (studyBeeError.type !== 'network') {
      toast({
        title: "Study Bee Error",
        description: studyBeeError.message,
        variant: "destructive"
      });
    }

    return studyBeeError;
  }, []);

  const retry = useCallback(async (retryFn: () => Promise<any>) => {
    if (!lastError?.retryable || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await retryFn();
      setLastError(null);
      toast({
        title: "Connection Restored",
        description: "Study Bee integration is working again."
      });
    } catch (error) {
      handleError(error, 'retry');
    } finally {
      setIsRetrying(false);
    }
  }, [lastError, isRetrying, handleError]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    lastError,
    isRetrying,
    handleError,
    retry,
    clearError
  };
}
