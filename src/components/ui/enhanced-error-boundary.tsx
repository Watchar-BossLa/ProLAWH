
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { handleError } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      retryCount: this.retryCount,
      timestamp: new Date().toISOString()
    };

    // Handle error with our centralized error handler
    handleError(error, errorDetails);

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      this.setState({ hasError: false, error: undefined });
    } else {
      // Max retries reached, reload the page
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="flex gap-2">
                {this.retryCount < this.maxRetries ? (
                  <Button 
                    onClick={this.handleRetry} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Try Again ({this.maxRetries - this.retryCount} left)
                  </Button>
                ) : (
                  <Button 
                    onClick={this.handleReload} 
                    variant="outline" 
                    size="sm"
                  >
                    Reload Page
                  </Button>
                )}
              </div>
              {this.state.errorId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
