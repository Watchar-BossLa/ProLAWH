
import { useEffect, useState } from "react";
import { useArcadeChallenges, type ArcadeChallenge } from "@/hooks/useArcadeChallenges";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ArcadePage() {
  const { data: challenges, isLoading } = useArcadeChallenges();
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and get user ID
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the Arcade",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const handleStartChallenge = async (challenge: ArcadeChallenge) => {
    try {
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to start challenges",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("challenge_attempts")
        .insert({
          challenge_id: challenge.id,
          user_id: userId,
          status: "started",
        });

      if (error) throw error;

      toast({
        title: "Challenge Started!",
        description: challenge.instructions,
      });

      // We'll implement the actual challenge UI in the next iteration
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading challenges...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nano-Challenge Arcade</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges?.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onStart={handleStartChallenge}
          />
        ))}
      </div>
    </div>
  );
}
