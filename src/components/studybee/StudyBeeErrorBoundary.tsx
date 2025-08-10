
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface StudyBeeErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isOffline: boolean;
}

interface StudyBeeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class StudyBeeErrorBoundary extends React.Component<
  StudyBeeErrorBoundaryProps,
  StudyBeeErrorBoundaryState
> {
  private retryTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(props: StudyBeeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isOffline: false
    };
  }

  static getDerivedStateFromError(error: Error): StudyBeeErrorBoundaryState {
    return {
      hasError: true,
      error,
      isOffline: error.message.includes('network') || error.message.includes('fetch')
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Study Bee Error:', error, errorInfo);
    
    // Log to analytics or error reporting service
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('study-bee-error', {
        detail: { error: error.message, stack: error.stack, errorInfo }
      }));
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    
    // Auto-retry after 5 seconds if it fails again
    this.retryTimeoutId = setTimeout(() => {
      if (this.state.hasError) {
        this.handleRetry();
      }
    }, 5000);
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">Study Bee Integration Error</p>
              <p className="text-sm mt-1">
                {this.state.isOffline 
                  ? "Unable to connect to Study Bee. Please check your internet connection."
                  : this.state.error?.message || "Something went wrong with the Study Bee integration."
                }
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleRetry}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
