
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.ComponentProps<typeof Card> {
  variant?: 'default' | 'glass' | 'elevated' | 'floating';
  interactive?: boolean;
  children?: React.ReactNode;
}

export function EnhancedCard({ 
  variant = 'default', 
  interactive = false, 
  className, 
  children, 
  ...props 
}: EnhancedCardProps) {
  const variantClasses = {
    default: '',
    glass: 'glass-card border-0',
    elevated: 'card-elevated border-0',
    floating: 'floating-action border-0'
  };

  return (
    <Card
      className={cn(
        variantClasses[variant],
        interactive && 'interactive-scale cursor-pointer',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Re-export existing Card components for backward compatibility
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
