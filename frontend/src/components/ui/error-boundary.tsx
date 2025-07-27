
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "warning";
  className?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component error caught by ErrorBoundary:", error, errorInfo);
    
    // Call the optional onError handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <Alert 
          variant={this.props.variant || "destructive"} 
          className={cn("mt-4", this.props.className)}
        >
          {this.props.icon || <AlertTriangle className="h-4 w-4" />}
          <AlertTitle>{this.props.title || "An error occurred"}</AlertTitle>
          <AlertDescription>
            <p>{this.props.description || "There was an error rendering this component."}</p>
            {this.state.error && (
              <p className="text-sm opacity-80 mt-2">
                {this.state.error?.message || "Unknown error"}
              </p>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
