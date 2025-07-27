
import { enterpriseLogger } from '../logging';

export class ErrorHandlers {
  static setupGlobalErrorHandlers(): void {
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      enterpriseLogger.error('Unhandled promise rejection', new Error(event.reason), {
        reason: event.reason,
        promise: event.promise.toString()
      }, 'GlobalErrorHandler');
    });

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      enterpriseLogger.error('Global JavaScript error', new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }, 'GlobalErrorHandler');
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        enterpriseLogger.error('Resource loading error', undefined, {
          tagName: (event.target as Element)?.tagName,
          source: (event.target as any)?.src || (event.target as any)?.href,
          type: event.type
        }, 'ResourceErrorHandler');
      }
    }, true);
  }
}
