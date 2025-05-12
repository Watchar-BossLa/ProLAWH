
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ArcadeChallenge = {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  points: number;
  time_limit: number;
  type: "ar" | "camera" | "code" | "quiz";
  instructions: string;
  validation_rules: Record<string, any>;
};

export function useArcadeChallenges() {
  return useQuery({
    queryKey: ["arcade-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arcade_challenges")
        .select("*")
        .order("difficulty_level", { ascending: true });

      if (error) throw error;
      return data as ArcadeChallenge[];
    },
  });
}
