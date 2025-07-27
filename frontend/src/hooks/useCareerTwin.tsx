
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CareerRecommendation {
  id: string;
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
  skills?: string[];
  resources?: any[];
}

export function useCareerTwin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch career recommendations
  const { 
    data: recommendations, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ["career-recommendations"],
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

  // Generate a new recommendation
  const generateRecommendation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to generate recommendations");
      
      const response = await fetch("/api/career-twin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate recommendation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-recommendations"] });
      toast({
        title: "Success",
        description: "New career recommendation generated!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update recommendation status
  const updateRecommendation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CareerRecommendation["status"] }) => {
      if (!user) throw new Error("You must be logged in to update recommendations");
      
      const { error } = await supabase
        .from("career_recommendations")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["career-recommendations"] });
      toast({
        title: "Status Updated",
        description: `Recommendation marked as ${variables.status}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create implementation plan for a recommendation
  const createImplementationPlan = useMutation({
    mutationFn: async ({ recommendationId, title, description, steps }: { 
      recommendationId: string; 
      title: string;
      description: string;
      steps: any[];
    }) => {
      if (!user) throw new Error("You must be logged in to create implementation plans");
      
      const { error } = await supabase
        .from("user_implementation_plans")
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          title,
          description,
          steps,
          status: 'in_progress'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Plan Created",
        description: "Implementation plan created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Track user activity for career twin interaction
  const trackActivity = async (activityType: string, metadata: any = {}) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: `career_twin_${activityType}`,
          metadata
        });
    } catch (err) {
      console.error('Error tracking activity:', err);
    }
  };

  return {
    recommendations,
    isLoading,
    error,
    refetch,
    generateRecommendation,
    updateRecommendation,
    createImplementationPlan,
    trackActivity
  };
}
