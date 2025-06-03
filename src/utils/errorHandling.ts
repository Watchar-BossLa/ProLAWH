
import { enterpriseLogger } from './logging';

export interface ErrorContext {
  operation?: string;
  userId?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export async function handleAsyncError<T>(
  asyncOperation: () => Promise<T>,
  context: ErrorContext = {}
): Promise<{ data?: T; error?: any }> {
  try {
    const data = await asyncOperation();
    return { data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
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

    return { error };
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
