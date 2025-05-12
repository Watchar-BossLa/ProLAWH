
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TimerProgressProps {
  percent: number;
  isRunning?: boolean;
  className?: string;
  smooth?: boolean;
}

export function TimerProgress({ 
  percent, 
  isRunning = true,
  smooth = true,
  className 
}: TimerProgressProps) {
  const [animated, setAnimated] = useState(false);
  
  // Add animation class only after initial render to prevent animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(isRunning && smooth), 100);
    return () => clearTimeout(timer);
  }, [isRunning, smooth]);
  
  const getColorClass = () => {
    if (percent > 60) return "bg-green-500 dark:bg-green-600";
    if (percent > 30) return "bg-amber-500 dark:bg-amber-600";
    return "bg-red-500 dark:bg-red-600";
  };
  
  return (
    <Progress 
      value={percent} 
      className={cn(
        "h-2 transition-all",
        getColorClass(),
        animated && "transition-all duration-1000",
        className
      )}
      aria-label={`${Math.round(percent)}% of time remaining`}
    />
  );
}
