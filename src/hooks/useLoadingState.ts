
import { useState, useCallback, useRef } from 'react';
import { handleAsyncError, AppError } from '@/utils/errorHandling';

interface LoadingState {
  [key: string]: boolean;
}

export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const [errors, setErrors] = useState<Record<string, AppError>>({});
  const loadingRef = useRef<LoadingState>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    loadingRef.current[key] = loading;
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
    
    // Clear error when starting new operation
    if (loading) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const getError = useCallback((key: string) => {
    return errors[key];
  }, [errors]);

  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const executeWithLoading = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: AppError) => void;
      context?: Record<string, any>;
    }
  ): Promise<{ data?: T; error?: AppError }> => {
    setLoading(key, true);

    const result = await handleAsyncError(operation, {
      operation: key, // Fixed: changed from operation_key to operation
      ...options?.context
    });

    setLoading(key, false);

    if (result.error) {
      setErrors(prev => ({ ...prev, [key]: result.error! }));
      options?.onError?.(result.error);
    } else {
      options?.onSuccess?.(result.data!);
    }

    return result;
  }, [setLoading]);

  const reset = useCallback(() => {
    setLoadingStates({});
    setErrors({});
    loadingRef.current = {};
  }, []);

  return {
    isLoading,
    setLoading,
    getError,
    clearError,
    executeWithLoading,
    reset,
    hasAnyLoading: isLoading(),
    hasAnyErrors: Object.keys(errors).length > 0
  };
}
