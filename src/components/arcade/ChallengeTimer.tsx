
import { useEffect, useState } from "react";
import { useChallengeTimer } from "@/hooks/useChallengeTimer";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerProgress } from "./timer/TimerProgress";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useChallengeState } from "@/hooks/useChallengeState";
import { AlertTriangle } from "lucide-react";

interface ChallengeTimerProps {
  duration: number;
  onTimeUp?: () => void;
  highPrecision?: boolean;
}

export function ChallengeTimer({ 
  duration, 
  onTimeUp,
  highPrecision = false
}: ChallengeTimerProps) {
  const { timeRemaining, isRunning, percentRemaining } = useChallengeTimer(
    duration,
    { 
      onTimeUp,
      tickInterval: highPrecision ? 16 : 1000 // 60fps (approximately 16ms) for high precision
    }
  );
  const { state } = useChallengeState();
  const [hasWarnedLowTime, setHasWarnedLowTime] = useState(false);
  const [hasWarnedCriticalTime, setHasWarnedCriticalTime] = useState(false);
  
  // Alert user when time is running low (15% remaining)
  useEffect(() => {
    if (isRunning && percentRemaining <= 15 && !hasWarnedLowTime) {
      toast({
        title: "Time is running out!",
        description: "Hurry up to complete the challenge.",
        variant: "default",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
      });
      setHasWarnedLowTime(true);
      
      // Announce time running out for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('role', 'status');
      announcement.classList.add('sr-only');
      announcement.textContent = "Warning: Time is running out! Only a few seconds remaining.";
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    }

    // Critical time warning (5% remaining)
    if (isRunning && percentRemaining <= 5 && !hasWarnedCriticalTime) {
      toast({
        title: "Critical time warning!",
        description: "Only seconds remaining to complete!",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />
      });
      setHasWarnedCriticalTime(true);
    }
  }, [percentRemaining, isRunning, hasWarnedLowTime, hasWarnedCriticalTime]);
  
  // Reset warning state when timer restarts
  useEffect(() => {
    if (percentRemaining > 90) {
      setHasWarnedLowTime(false);
      setHasWarnedCriticalTime(false);
    }
  }, [percentRemaining]);
  
  // Get appropriate color based on time remaining
  const getColorClass = () => {
    if (percentRemaining > 50) return "text-green-500";
    if (percentRemaining > 25) return "text-amber-500";
    return "text-red-500";
  };

  // Add pulse animation when time is critical
  const getPulseClass = () => {
    if (percentRemaining <= 10 && isRunning) return "animate-pulse";
    return "";
  };
  
  return (
    <Card className="relative p-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <TimerProgress 
          percent={percentRemaining} 
          isRunning={isRunning}
          smooth={!highPrecision}
          aria-hidden="true"
        />
      </div>
      
      <div className={`relative z-10 flex flex-col items-center ${getPulseClass()}`}>
        <span className="text-sm font-medium mb-1">Time Remaining</span>
        <TimerDisplay 
          seconds={timeRemaining} 
          showMilliseconds={highPrecision}
          className={`text-2xl font-mono font-bold ${getColorClass()}`}
          aria-live="polite"
          aria-label={`${Math.floor(timeRemaining / 60)} minutes and ${Math.floor(timeRemaining % 60)} seconds remaining`}
        />
        <span className="text-xs text-muted-foreground mt-1">
          {Math.round(percentRemaining)}% remaining
        </span>
      </div>
    </Card>
  );
}
