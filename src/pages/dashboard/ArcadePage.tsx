
import { useEffect, useState } from "react";
import { useArcadeChallenges } from "@/hooks/useArcadeChallenges";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { pageTransitions } from "@/lib/transitions";

export default function ArcadePage() {
  const { data: challenges, isLoading, error } = useArcadeChallenges();
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Challenges</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Nano-Challenge Arcade</h1>
          <p className="text-muted-foreground">Complete quick challenges to earn verifiable credentials</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : challenges?.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Challenges Available</h3>
          <p className="text-muted-foreground">Check back soon for new challenges!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-500">
          {challenges?.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
