
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  points: number;
  time_limit: number;
  type: "ar" | "camera" | "code" | "quiz";
  instructions: string;
  validation_rules: {
    required_items: string[];
    min_confidence?: number;
  };
}

export function useChallenge(challengeId: string | undefined) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

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
    };

    checkAuthAndLoadChallenge();
  }, [challengeId, navigate]);

  return { challenge, userId };
}
