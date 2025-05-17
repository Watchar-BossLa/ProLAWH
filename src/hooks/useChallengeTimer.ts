
import { useState, useEffect } from 'react';

interface UseTimerProps {
  initialTime: number;
  onTimeUpdate: (timeLeft: number) => void;
  onTimeUp: () => void;
}

export function useChallengeTimer({ initialTime, onTimeUpdate, onTimeUp }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTimeUpdate(newTime);
        
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

  return { timeLeft, isRunning };
}
