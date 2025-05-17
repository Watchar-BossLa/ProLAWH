
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
      const { data: attemptData, error } = await supabase
        .from('challenge_attempts')
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          status: 'started',
        })
        .select()
        .single();

      if (error) throw error;

      setAttemptId(attemptData.id);
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
        })
        .eq('id', attemptId);

      if (error) throw error;

      setStatus(success ? 'completed' : 'failed');
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
