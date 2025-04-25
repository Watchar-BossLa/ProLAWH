
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChallengeTimer from "./ChallengeTimer";
import CameraChallenge from "./CameraChallenge";
import ChallengeCompletion from "./ChallengeCompletion";
import { Challenge } from "@/hooks/useChallenge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ChallengeContainerProps {
  challenge: Challenge;
  userId: string;
  onReturn: () => void;
}

export function ChallengeContainer({ challenge, userId, onReturn }: ChallengeContainerProps) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [status, setStatus] = useState<"ready" | "active" | "completed" | "failed">("ready");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<{
    success: boolean;
    points: number;
    message: string;
  } | null>(null);

  const startChallenge = async () => {
    try {
      const { data: attemptData, error } = await supabase
        .from("challenge_attempts")
        .insert({
          challenge_id: challenge.id,
          user_id: userId,
          status: "started",
        })
        .select()
        .single();

      if (error) throw error;

      setAttemptId(attemptData.id);
      setStatus("active");
    } catch (error: any) {
      toast({
        title: "Error Starting Challenge",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (
    success: boolean,
    submissionData: Record<string, any>,
    pointsEarned: number
  ) => {
    if (!attemptId) return;

    try {
      const timeTaken = challenge.time_limit - timeLeft;
      
      const { error } = await supabase
        .from("challenge_attempts")
        .update({
          status: success ? "completed" : "failed",
          completed_at: new Date().toISOString(),
          submission_data: submissionData,
          points_earned: pointsEarned,
          time_taken: timeTaken,
        })
        .eq("id", attemptId);

      if (error) throw error;

      setStatus("completed");
      setResult({
        success,
        points: pointsEarned,
        message: success 
          ? "Congratulations! Challenge completed successfully." 
          : "Challenge failed. Try again!"
      });
    } catch (error: any) {
      toast({
        title: "Error Completing Challenge",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTimeUp = () => {
    setStatus("failed");
    handleComplete(false, {}, 0);
  };

  const retryChallenge = () => {
    setStatus("ready");
    setTimeLeft(challenge.time_limit);
    setResult(null);
  };

  if (status === "ready") {
    return (
      <div className="flex justify-center pt-4">
        <Button onClick={startChallenge} size="lg">
          Start Challenge
        </Button>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="space-y-4">
        <ChallengeTimer 
          initialTime={challenge.time_limit} 
          onTimeUpdate={setTimeLeft}
          onTimeUp={handleTimeUp}
        />
        
        {challenge.type === "camera" ? (
          <CameraChallenge 
            challenge={{
              id: challenge.id,
              validation_rules: challenge.validation_rules,
              points: challenge.points
            }} 
            onComplete={handleComplete}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {challenge.type.toUpperCase()} challenges are coming soon!
            </p>
            <Button onClick={onReturn} className="mt-4">
              Return to Arcade
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ChallengeCompletion 
      result={result}
      onRetry={retryChallenge}
      onReturn={onReturn}
    />
  );
}
