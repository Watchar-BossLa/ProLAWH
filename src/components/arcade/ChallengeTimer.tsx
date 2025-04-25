
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

interface ChallengeTimerProps {
  initialTime: number;
  onTimeUpdate: (timeLeft: number) => void;
  onTimeUp: () => void;
}

/**
 * A timer component for challenges that shows progress and time remaining
 */
export default function ChallengeTimer({ 
  initialTime, 
  onTimeUpdate,
  onTimeUp 
}: ChallengeTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Update parent component with time left
        onTimeUpdate(newTime);
        
        // Check if time is up
        if (newTime <= 0) {
          clearInterval(timer);
          setIsRunning(false);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRunning, onTimeUpdate, onTimeUp]);
  
  // Calculate progress percentage
  const progressPercentage = Math.max(0, (timeLeft / initialTime) * 100);
  
  // Determine color based on time remaining
  const getColorClass = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4" />
          <span className="font-medium">Time Remaining</span>
        </div>
        <div className="text-lg font-bold">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-2"
        indicatorClassName={getColorClass()}
      />
    </div>
  );
}
