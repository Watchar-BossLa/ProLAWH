/**
 * Production-ready error handling for DSPy operations
 */

export interface DSPyError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
  retryCount?: number;
}

export class DSPyErrorHandler {
  private static instance: DSPyErrorHandler;
  private errorLog: DSPyError[] = [];
  private maxLogSize = 1000;

  static getInstance(): DSPyErrorHandler {
    if (!DSPyErrorHandler.instance) {
      DSPyErrorHandler.instance = new DSPyErrorHandler();
    }
    return DSPyErrorHandler.instance;
  }

  handleError(error: any, context: string, metadata?: any): DSPyError {
    const dspyError: DSPyError = {
      code: this.getErrorCode(error),
      message: error.message || 'Unknown error',
      details: { context, metadata, stack: error.stack },
      timestamp: new Date(),
      recoverable: this.isRecoverable(error),
      retryCount: 0
    };

    this.logError(dspyError);
    this.notifyMonitoring(dspyError);
    
    return dspyError;
  }

  async handleWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    context: string
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const dspyError = this.handleError(error, context, { attempt });
        
        if (!dspyError.recoverable || attempt === maxRetries) {
          throw dspyError;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
    
    throw lastError;
  }

  private getErrorCode(error: any): string {
    if (error.code) return error.code;
    if (error.message?.includes('rate limit')) return 'RATE_LIMIT';
    if (error.message?.includes('timeout')) return 'TIMEOUT';
    if (error.message?.includes('network')) return 'NETWORK_ERROR';
    if (error.message?.includes('authentication')) return 'AUTH_ERROR';
    if (error.message?.includes('optimization')) return 'OPTIMIZATION_ERROR';
    return 'UNKNOWN_ERROR';
  }

  private isRecoverable(error: any): boolean {
    const recoverableCodes = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR'];
    return recoverableCodes.includes(this.getErrorCode(error));
  }

  private logError(error: DSPyError): void {
    console.error(`[DSPy Error] ${error.code}: ${error.message}`, error.details);
    
    this.errorLog.push(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  private notifyMonitoring(error: DSPyError): void {
    // Integration with monitoring service
    if (error.code === 'OPTIMIZATION_ERROR') {
      // Trigger alert for optimization failures
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getErrorHistory(): DSPyError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}