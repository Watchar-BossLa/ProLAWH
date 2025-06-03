
import { enterpriseLogger } from './logging';

export interface ErrorContext {
  operation?: string;
  userId?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export interface AppError {
  message: string;
  code?: string;
  context?: ErrorContext;
  originalError?: Error;
}

export async function handleAsyncError<T>(
  asyncOperation: () => Promise<T>,
  context: ErrorContext = {}
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await asyncOperation();
    return { data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const appError: AppError = {
      message: errorMessage,
      context,
      originalError: error instanceof Error ? error : undefined
    };
    
    enterpriseLogger.error(
      `Error in ${context.operation || 'async operation'}: ${errorMessage}`,
      error as Error,
      {
        ...context.metadata,
        userId: context.userId,
        component: context.component
      },
      context.component || 'ErrorHandler'
    );

    return { error: appError };
  }
}

export function handleSyncError(
  error: any,
  context: ErrorContext = {}
): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  enterpriseLogger.error(
    `Error in ${context.operation || 'sync operation'}: ${errorMessage}`,
    error as Error,
    {
      ...context.metadata,
      userId: context.userId,
      component: context.component
    },
    context.component || 'ErrorHandler'
  );
}

// Export handleError as an alias for handleSyncError for backwards compatibility
export const handleError = handleSyncError;
