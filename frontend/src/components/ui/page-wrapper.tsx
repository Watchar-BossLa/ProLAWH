
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageWrapper({ children, className, title, description }: PageWrapperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground max-w-4xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
