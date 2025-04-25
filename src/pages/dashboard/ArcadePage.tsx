
import { useArcadeChallenges, type ArcadeChallenge } from "@/hooks/useArcadeChallenges";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ArcadePage() {
  const { data: challenges, isLoading } = useArcadeChallenges();

  const handleStartChallenge = async (challenge: ArcadeChallenge) => {
    try {
      const { error } = await supabase
        .from("challenge_attempts")
        .insert({
          challenge_id: challenge.id,
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
