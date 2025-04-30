
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface CareerRecommendation {
  id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: "pending" | "accepted" | "rejected" | "implemented";
  created_at?: string;
}

export function useCareerRecommendations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["career-recommendations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("career_recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CareerRecommendation[];
    },
    enabled: !!user
  });

  const updateRecommendation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CareerRecommendation["status"] }) => {
      const { error } = await supabase
        .from("career_recommendations")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-recommendations", user?.id] });
    },
  });

  const generateNewRecommendation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const response = await fetch("/api/career-twin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate recommendation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-recommendations", user?.id] });
    },
  });

  return {
    recommendations,
    isLoading,
    updateRecommendation,
    generateNewRecommendation
  };
}
