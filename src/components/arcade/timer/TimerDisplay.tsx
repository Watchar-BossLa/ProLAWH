
import { Timer } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  return (
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
  );
}
