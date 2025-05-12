
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ChallengeResult } from "@/types/arcade";

interface UseChallengesProps {
  userId: string | undefined;
}

interface UseChallengesReturn {
  submitChallengeResult: (challengeId: string, result: Partial<ChallengeResult>) => Promise<boolean>;
  userChallenges: {id: string, completedAt: Date | null}[];
  isLoading: boolean;
  error: Error | null;
}

export function useChallenges({ userId }: UseChallengesProps): UseChallengesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userChallenges, setUserChallenges] = useState<{id: string, completedAt: Date | null}[]>([]);
  
  useEffect(() => {
    if (userId) {
      fetchUserChallenges();
    }
  }, [userId]);
  
  const fetchUserChallenges = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenge_attempts')
        .select('challenge_id, completed_at')
        .eq('user_id', userId);
        
      if (error) throw error;
      setUserChallenges(data.map(item => ({
        id: item.challenge_id,
        completedAt: item.completed_at ? new Date(item.completed_at) : null
      })));
    } catch (err) {
      console.error("Error fetching user challenges:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitChallengeResult = async (challengeId: string, result: Partial<ChallengeResult>) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit challenge results",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Record challenge attempt
      const { error } = await supabase
        .from('challenge_attempts')
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          status: result.success ? 'completed' : 'failed',
          points_earned: result.points || 0,
          submission_data: { message: result.message },
          completed_at: result.success ? new Date().toISOString() : null
        });
        
      if (error) throw error;
      
      // Refresh challenges
      await fetchUserChallenges();
      
      if (result.success) {
        toast({
          title: "Challenge completed",
          description: `You earned ${result.points} points!`,
        });
      } else {
        toast({
          title: "Challenge failed",
          description: result.message || "Better luck next time",
          variant: "destructive"
        });
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error submitting result'));
      console.error("Error submitting challenge result:", err);
      
      toast({
        title: "Submission failed",
        description: "There was an error recording your results",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitChallengeResult,
    userChallenges,
    isLoading,
    error
  };
}
