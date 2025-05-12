
import { useState, useEffect, useCallback, useRef } from "react";
import { useChallengeState } from "./useChallengeState";

interface UseTimerOptions {
  autoStart?: boolean;
  onTimeUp?: () => void;
  tickInterval?: number;
}

export function useChallengeTimer(
  durationInSeconds: number,
  options: UseTimerOptions = {}
) {
  const { autoStart = false, onTimeUp, tickInterval = 1000 } = options;
  const { state } = useChallengeState();
  
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRemainingRef = useRef<number>(durationInSeconds);
  
  // Calculate percentage of time remaining
  const percentRemaining = Math.max(0, Math.min(100, (timeRemaining / durationInSeconds) * 100));
  
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const start = useCallback(() => {
    if (isRunning) return;
    
    clearTimer();
    startTimeRef.current = Date.now();
    setIsRunning(true);
    
    timerRef.current = window.setInterval(() => {
      const elapsedSeconds = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : 0;
      
      const newTimeRemaining = Math.max(
        0,
        pausedTimeRemainingRef.current - elapsedSeconds
      );
      
      setTimeRemaining(newTimeRemaining);
      
      if (newTimeRemaining <= 0) {
        clearTimer();
        setIsRunning(false);
        onTimeUp?.();
      }
    }, tickInterval);
  }, [isRunning, clearTimer, onTimeUp, tickInterval]);
  
  const pause = useCallback(() => {
    if (!isRunning) return;
    
    clearTimer();
    pausedTimeRemainingRef.current = timeRemaining;
    setIsRunning(false);
  }, [isRunning, timeRemaining, clearTimer]);
  
  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(durationInSeconds);
    pausedTimeRemainingRef.current = durationInSeconds;
    startTimeRef.current = null;
    setIsRunning(autoStart);
    
    if (autoStart) {
      start();
    }
  }, [durationInSeconds, autoStart, clearTimer, start]);
  
  // Handle state changes from challenge state
  useEffect(() => {
    if (state === 'active') {
      start();
    } else if (state === 'paused') {
      pause();
    } else if (state === 'ready') {
      reset();
    }
  }, [state, start, pause, reset]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);
  
  return {
    timeRemaining,
    isRunning,
    start,
    pause,
    reset,
    percentRemaining,
    totalDuration: durationInSeconds,
  };
}
