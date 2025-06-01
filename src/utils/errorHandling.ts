
import { toast } from '@/hooks/use-toast';

export interface AppError {
  message: string;
  code?: string;
  context?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export class ProLawhError extends Error {
  public code?: string;
  public context?: Record<string, any>;
  public severity: 'info' | 'warning' | 'error' | 'critical';

  constructor(message: string, options?: {
    code?: string;
    context?: Record<string, any>;
    severity?: 'info' | 'warning' | 'error' | 'critical';
  }) {
    super(message);
    this.name = 'ProLawhError';
    this.code = options?.code;
    this.context = options?.context;
    this.severity = options?.severity || 'error';
  }
}

export const handleError = (error: unknown, context?: Record<string, any>) => {
  let appError: AppError;

  if (error instanceof ProLawhError) {
    appError = {
      message: error.message,
      code: error.code,
      context: { ...error.context, ...context },
      severity: error.severity
    };
  } else if (error instanceof Error) {
    appError = {
      message: error.message,
      context,
      severity: 'error'
    };
  } else {
    appError = {
      message: 'An unexpected error occurred',
      context,
      severity: 'error'
    };
  }

  // Log error for monitoring
  console.error('[ProLawh Error]', appError);

  // Show user-friendly toast
  const shouldShowToast = appError.severity !== 'info';
  if (shouldShowToast) {
    toast({
      title: appError.severity === 'critical' ? 'Critical Error' : 'Error',
      description: appError.message,
      variant: 'destructive'
    });
  }

  return appError;
};

export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const appError = handleError(error, context);
    return { error: appError };
  }
};
