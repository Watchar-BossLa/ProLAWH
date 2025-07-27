
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CareerRecommendation {
  id: string;
  type: string;
  recommendation: string;
  relevance_score: number;
  status: "pending" | "accepted" | "rejected";
  created_at?: string;
}

export function useCareerRecommendations() {
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["career-recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("career_recommendations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CareerRecommendation[];
    }
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
      queryClient.invalidateQueries({ queryKey: ["career-recommendations"] });
    },
  });

  const generateNewRecommendation = useMutation({
    mutationFn: async () => {
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
      queryClient.invalidateQueries({ queryKey: ["career-recommendations"] });
    },
  });

  return {
    recommendations,
    isLoading,
    updateRecommendation,
    generateNewRecommendation
  };
}
