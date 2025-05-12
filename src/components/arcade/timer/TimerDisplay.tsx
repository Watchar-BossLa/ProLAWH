
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  seconds: number;
  className?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-label'?: string;
}

export function TimerDisplay({ 
  seconds, 
  className,
  ...props
}: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="font-mono">{formattedTime}</span>
    </div>
  );
}
