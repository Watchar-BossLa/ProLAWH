
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  seconds: number;
  className?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-label'?: string;
  showMilliseconds?: boolean;
}

export function TimerDisplay({ 
  seconds, 
  className,
  showMilliseconds = false,
  ...props
}: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  const formattedTime = showMilliseconds
    ? `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0').substring(0, 2)}`
    : `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="font-mono">{formattedTime}</span>
    </div>
  );
}
