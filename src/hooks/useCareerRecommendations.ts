
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
  skills?: string[];
  resources?: {
    type: string;
    url?: string;
    title: string;
  }[];
}

interface GenerateRecommendationResponse {
  success: boolean;
  data: {
    type: 'skill_gap' | 'job_match' | 'mentor_suggest';
    text: string;
    score: number;
    skills: string[];
  };
}

export function useCareerRecommendations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["career-recommendations", user?.id],
    queryFn: async (): Promise<CareerRecommendation[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("career_recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Ensure the type field is properly cast
      return (data || []).map(item => ({
        ...item,
        type: item.type as 'skill_gap' | 'job_match' | 'mentor_suggest'
      })) as CareerRecommendation[];
    },
    enabled: !!user
  });

  const updateRecommendation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CareerRecommendation["status"] }): Promise<void> => {
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
    mutationFn: async (): Promise<GenerateRecommendationResponse> => {
      if (!user) throw new Error("User not authenticated");
      
      // Get the full URL for the function call
      const functionUrl = `https://pynytoroxsqvfxybjeft.supabase.co/functions/v1/generate-career-twin`;
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error("Invalid authentication session");
      }
      
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate recommendation");
      }
      
      return response.json() as Promise<GenerateRecommendationResponse>;
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
