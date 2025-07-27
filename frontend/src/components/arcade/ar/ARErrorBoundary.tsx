
import React from "react";
import { ErrorBoundary, ErrorBoundaryProps } from "@/components/ui/error-boundary";
import { AlertTriangle } from "lucide-react";

type ARErrorBoundaryProps = Omit<ErrorBoundaryProps, 'title' | 'description' | 'icon'>;

const ARErrorBoundary: React.FC<ARErrorBoundaryProps> = ({ 
  children, 
  fallback, 
  className,
  variant = "destructive",
  onError,
  ...rest 
}) => {
  return (
    <ErrorBoundary
      fallback={fallback}
      title="AR Experience Error"
      description="There was an error loading the AR experience."
      icon={<AlertTriangle className="h-4 w-4" />}
      variant={variant}
      className={className}
      onError={onError}
      {...rest}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ARErrorBoundary;
