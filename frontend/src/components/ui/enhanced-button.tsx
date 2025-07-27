
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  enhancement?: 'glass' | 'gradient' | 'floating' | 'minimal';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function EnhancedButton({
  enhancement,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const enhancementClasses = {
    glass: 'glass-card hover:backdrop-blur-md border-white/20',
    gradient: 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70',
    floating: 'floating-action hover:shadow-xl',
    minimal: 'bg-transparent hover:bg-primary/5 border-primary/20'
  };

  const isDisabled = disabled || loading;

  return (
    <Button
      className={cn(
        enhancement && enhancementClasses[enhancement],
        'transition-all duration-300 focus-enhanced',
        isDisabled && 'opacity-50 pointer-events-none',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </Button>
  );
}

// Re-export original Button for backward compatibility
export { Button };
