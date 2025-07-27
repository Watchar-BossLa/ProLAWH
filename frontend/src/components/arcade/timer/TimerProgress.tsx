
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TimerProgressProps {
  timeLeft: number;
  initialTime: number;
}

export function TimerProgress({ timeLeft, initialTime }: TimerProgressProps) {
  const progressPercentage = Math.max(0, (timeLeft / initialTime) * 100);
  
  const getColorClass = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <Progress 
      value={progressPercentage} 
      className={cn("h-2", getColorClass())}
    />
  );
}
