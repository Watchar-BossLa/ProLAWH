
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useCareerTwin, CareerRecommendation } from "@/hooks/useCareerTwin";

interface MentorRecommendation {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorExpertise: string[];
  matchReason: string;
  relevanceScore: number;
  recommendationId?: string;
}

interface MentorProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
}

// Type guard to check if an object is a valid MentorProfile
function isMentorProfile(obj: any): obj is MentorProfile {
  return obj && typeof obj === 'object' && 'id' in obj;
}

export function useCareerTwinMentorship() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { trackActivity, recommendations } = useCareerTwin();
  
  // Get mentor recommendations from career twin
  const { data: mentorRecommendations, isLoading, error } = useQuery({
    queryKey: ["mentor-recommendations"],
    queryFn: async () => {
      if (!user) return [];
      
      // First get the mentor-type recommendations
      const mentorTypeRecommendations = recommendations?.filter(
        rec => rec.type === 'mentor_suggest'
      ) || [];
      
      // For each mentor recommendation, try to find matching mentors
      const mentorMatches: MentorRecommendation[] = [];
      
      for (const rec of mentorTypeRecommendations) {
        if (!rec.skills || rec.skills.length === 0) continue;
        
        // Find mentors that match the skills in the recommendation 
        // Updated to work with the mock client
        const { data: mentors, error } = await supabase
          .from("mentors")
          .select(`
            id,
            expertise,
            profiles:id (full_name, avatar_url)
          `);
          
        if (error || !mentors) continue;
        
        // Add matching mentors to the list with relevance scoring
        for (const mentor of mentors) {
          // Calculate match score based on overlapping skills
          const mentorSkills = mentor.expertise || [];
          const overlapCount = mentorSkills.filter(skill => 
            rec.skills?.includes(skill)
          ).length;
          
          const relevanceScore = overlapCount / Math.max(1, mentorSkills.length);
          
          // Safely handle the profile data
          const profileData = mentor.profiles;
          let fullName = "Unnamed Mentor";
          
          // Fix: Make sure profileData is not null and is an object
          if (profileData && typeof profileData === 'object') {
            // TypeScript now knows profileData is an object
            const profile = profileData as Record<string, unknown>;
            // Now check if full_name exists and is a string
            if ('full_name' in profile && typeof profile.full_name === 'string') {
              fullName = profile.full_name || "Unnamed Mentor";
            }
          }
          
          mentorMatches.push({
            id: `${rec.id}-${mentor.id}`,
            mentorId: mentor.id,
            mentorName: fullName,
            mentorExpertise: mentor.expertise || [],
            matchReason: rec.recommendation,
            relevanceScore: relevanceScore,
            recommendationId: rec.id
          });
        }
      }
      
      // Sort by relevance score
      return mentorMatches.sort((a, b) => b.relevanceScore - a.relevanceScore);
    },
    enabled: !!user && !!recommendations
  });

  // Request mentorship from a recommended mentor
  const requestMentorship = useMutation({
    mutationFn: async ({ 
      mentorId, 
      message, 
      focusAreas, 
      industry,
      recommendationId 
    }: { 
      mentorId: string; 
      message: string;
      focusAreas: string[];
      industry: string;
      recommendationId?: string;
    }) => {
      if (!user) throw new Error("You must be logged in to request mentorship");
      
      const { data, error } = await supabase
        .from("mentorship_requests")
        .insert({
          requester_id: user.id,
          mentor_id: mentorId,
          message,
          focus_areas: focusAreas,
          industry,
          status: "pending"
        });
      
      if (error) throw error;
      
      // Track this activity
      trackActivity("request_mentorship", {
        mentor_id: mentorId,
        recommendation_id: recommendationId,
        request_id: "mock-id" // Using mock ID since the mock client doesn't return real IDs
      });
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Request Sent",
        description: "Your mentorship request has been sent.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["mentor-recommendations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    mentorRecommendations,
    isLoading,
    error,
    requestMentorship
  };
}
