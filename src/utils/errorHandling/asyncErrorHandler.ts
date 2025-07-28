import { ErrorContext, ErrorSeverity } from './types';

export class AppError extends Error {
  constructor(
    message: string,
    public severity: ErrorSeverity = 'medium',
    public context?: ErrorContext,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  context?: ErrorContext
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(
          error instanceof Error ? error.message : 'Unknown error',
          'medium',
          context,
          error instanceof Error ? error : undefined
        );

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Async operation failed:', appError);
    }

    return { error: appError };
  }
}