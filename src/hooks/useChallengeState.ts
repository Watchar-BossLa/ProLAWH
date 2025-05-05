
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ChallengeResult } from '@/types/arcade';

export type ChallengeStatus = 'ready' | 'active' | 'completed' | 'failed';

export function useChallengeState(challengeId: string, userId: string) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [status, setStatus] = useState<ChallengeStatus>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<ChallengeResult | null>(null);

  const startChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_attempts')
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          status: 'started',
        });

      if (error) throw error;

      // Safely access the ID if data exists
      if (data && Array.isArray(data) && data[0]) {
        setAttemptId(data[0].id || 'temp-id');
      } else if (data && typeof data === 'object') {
        // Handle case where data might be a single object
        setAttemptId((data as any).id || 'temp-id');
      } else {
        setAttemptId('temp-id'); // Fallback
      }
      
      setStatus('active');
    } catch (error: any) {
      toast({
        title: 'Error Starting Challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleComplete = async (
    success: boolean,
    submissionData: Record<string, any>,
    pointsEarned: number,
    timeTaken: number
  ) => {
    if (!attemptId) return;

    try {
      const { error } = await supabase
        .from('challenge_attempts')
        .update({
          status: success ? 'completed' : 'failed',
          completed_at: new Date().toISOString(),
          submission_data: submissionData,
          points_earned: pointsEarned,
          time_taken: timeTaken,
        });

      if (error) throw error;

      setStatus('completed');
      setResult({
        success,
        points: pointsEarned,
        message: success 
          ? 'Congratulations! Challenge completed successfully.' 
          : 'Challenge failed. Try again!'
      });
    } catch (error: any) {
      toast({
        title: 'Error Completing Challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    status,
    timeLeft,
    result,
    setTimeLeft,
    startChallenge,
    handleComplete,
    setStatus
  };
}
