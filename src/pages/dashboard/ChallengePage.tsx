import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import ChallengeTimer from "@/components/arcade/ChallengeTimer";
import CameraChallenge from "@/components/arcade/CameraChallenge";
import ChallengeCompletion from "@/components/arcade/ChallengeCompletion";

type ChallengeStatus = "loading" | "ready" | "active" | "completed" | "failed";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  points: number;
  time_limit: number;
  type: "ar" | "camera" | "code" | "quiz";
  instructions: string;
  validation_rules: {
    required_items?: string[];
    min_confidence?: number;
    [key: string]: any;
  };
}

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [status, setStatus] = useState<ChallengeStatus>("loading");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [result, setResult] = useState<{
    success: boolean;
    points: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    const checkAuthAndLoadChallenge = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access challenges",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);

      if (!challengeId) {
        toast({
          title: "Invalid Challenge",
          description: "Challenge not found",
          variant: "destructive",
        });
        navigate("/dashboard/arcade");
        return;
      }

      const { data: challengeData, error } = await supabase
        .from("arcade_challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (error || !challengeData) {
        toast({
          title: "Challenge Not Found",
          description: "The requested challenge could not be found",
          variant: "destructive",
        });
        navigate("/dashboard/arcade");
        return;
      }

      setChallenge(challengeData as Challenge);
      setTimeLeft(challengeData.time_limit);
      setStatus("ready");
    };

    checkAuthAndLoadChallenge();
  }, [challengeId, navigate]);

  const startChallenge = async () => {
    if (!challenge || !userId) return;

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
      const timeTaken = challenge ? challenge.time_limit - timeLeft : 0;
      
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

  const returnToArcade = () => {
    navigate("/dashboard/arcade");
  };

  const retryChallenge = () => {
    setStatus("ready");
    setTimeLeft(challenge?.time_limit || 0);
    setResult(null);
  };

  const renderChallengeContent = () => {
    if (!challenge) return null;

    switch (status) {
      case "loading":
        return <div className="text-center py-8">Loading challenge...</div>;
      
      case "ready":
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-2xl font-bold">{challenge.title}</h2>
              {challenge.description && (
                <p className="text-muted-foreground mt-2">{challenge.description}</p>
              )}
            </div>
            
            <Alert>
              <Timer className="h-4 w-4" />
              <AlertTitle>Time Limit: {challenge.time_limit} seconds</AlertTitle>
              <AlertDescription>
                This challenge has a strict time limit. You'll need to complete it before time runs out.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Instructions:</h3>
              <p>{challenge.instructions}</p>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button onClick={startChallenge} size="lg">
                Start Challenge
              </Button>
            </div>
          </div>
        );
      
      case "active":
        return (
          <div className="space-y-4">
            <ChallengeTimer 
              initialTime={challenge.time_limit} 
              onTimeUpdate={setTimeLeft}
              onTimeUp={handleTimeUp}
            />
            
            {challenge.type === "camera" && (
              <CameraChallenge 
                challenge={{
                  id: challenge.id,
                  validation_rules: {
                    required_items: challenge.validation_rules.required_items || [],
                    min_confidence: challenge.validation_rules.min_confidence
                  },
                  points: challenge.points
                }} 
                onComplete={handleComplete}
              />
            )}
            
            {challenge.type !== "camera" && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {challenge.type.toUpperCase()} challenges are coming soon!
                </p>
                <Button onClick={returnToArcade} className="mt-4">
                  Return to Arcade
                </Button>
              </div>
            )}
          </div>
        );
      
      case "completed":
        return (
          <ChallengeCompletion 
            result={result}
            onRetry={retryChallenge}
            onReturn={returnToArcade}
          />
        );
      
      case "failed":
        return (
          <ChallengeCompletion 
            result={result}
            onRetry={retryChallenge}
            onReturn={returnToArcade}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {renderChallengeContent()}
      </div>
    </div>
  );
}
