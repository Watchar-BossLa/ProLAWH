
import { useChallengeTimer } from '@/hooks/useChallengeTimer';
import { TimerDisplay } from './timer/TimerDisplay';
import { TimerProgress } from './timer/TimerProgress';

interface ChallengeTimerProps {
  initialTime: number;
  onTimeUpdate: (timeLeft: number) => void;
  onTimeUp: () => void;
}

export default function ChallengeTimer({ 
  initialTime, 
  onTimeUpdate,
  onTimeUp 
}: ChallengeTimerProps) {
  const { timeLeft } = useChallengeTimer({
    initialTime,
    onTimeUpdate,
    onTimeUp
  });
  
  return (
    <div className="space-y-2 py-2">
      <TimerDisplay timeLeft={timeLeft} />
      <TimerProgress timeLeft={timeLeft} initialTime={initialTime} />
    </div>
  );
}
