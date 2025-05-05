
import { useEffect } from 'react';
import { useChallengeTimer } from '@/hooks/useChallengeTimer';
import { Card, CardContent } from '@/components/ui/card';
import { TimerDisplay } from './timer/TimerDisplay';
import { TimerProgress } from './timer/TimerProgress';

interface ChallengeTimerProps {
  initialTime: number;
  onTimeUpdate: (time: number) => void;
  onTimeUp: () => void;
}

export default function ChallengeTimer({ initialTime, onTimeUpdate, onTimeUp }: ChallengeTimerProps) {
  const { timeLeft, isRunning } = useChallengeTimer({ 
    initialTime, 
    onTimeUpdate, 
    onTimeUp 
  });

  // Update the document title to show the timer
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} | Challenge`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [timeLeft]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <TimerDisplay timeLeft={timeLeft} />
          <TimerProgress timeLeft={timeLeft} initialTime={initialTime} />
        </div>
      </CardContent>
    </Card>
  );
}
