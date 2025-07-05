
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BehaviorProfile } from '@/types/ai-matching';

export function useBehaviorProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's behavioral profile - using profiles table as fallback since user_behavior_profiles doesn't exist
  const { data: behaviorProfile, isLoading } = useQuery({
    queryKey: ['behavior-profile', user?.id],
    queryFn: async (): Promise<BehaviorProfile | null> => {
      if (!user) return null;
      
      try {
        // Since user_behavior_profiles doesn't exist, create a mock profile for now
        // In production, this table would need to be created first
        const mockProfile: BehaviorProfile = {
          id: user.id,
          user_id: user.id,
          work_style_preferences: { collaborative: 0.8, independent: 0.6 },
          collaboration_preferences: { team_size: 'small', communication_style: 'async' },
          learning_preferences: { pace: 'self-paced', format: 'interactive' },
          career_goals: { short_term: 'skill_development', long_term: 'leadership' },
          risk_tolerance: 0.7,
          flexibility_score: 0.8,
          communication_style: 'collaborative',
          preferred_project_duration: ['1-3 months', '3-6 months'],
          industry_preferences: ['technology', 'sustainability'],
          location_preferences: { remote: true, hybrid: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return mockProfile;
      } catch (error) {
        console.error('Error creating behavior profile:', error);
        return null;
      }
    },
    enabled: !!user,
  });

  // Update user behavioral profile
  const updateBehaviorProfile = useMutation({
    mutationFn: async (profileData: Partial<BehaviorProfile>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Mock update since table doesn't exist
      console.log('Would update behavior profile:', profileData);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['behavior-profile'] });
    },
  });

  return {
    behaviorProfile,
    isLoading,
    updateBehaviorProfile: updateBehaviorProfile.mutate,
    isUpdating: updateBehaviorProfile.isPending,
  };
}
