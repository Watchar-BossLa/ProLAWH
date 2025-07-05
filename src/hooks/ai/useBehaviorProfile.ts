
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BehaviorProfile } from '@/types/ai-matching';

export function useBehaviorProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's behavioral profile
  const { data: behaviorProfile, isLoading } = useQuery({
    queryKey: ['behavior-profile', user?.id],
    queryFn: async (): Promise<BehaviorProfile | null> => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from('user_behavior_profiles' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching behavior profile:', error);
          return null;
        }
        
        return data as BehaviorProfile | null;
      } catch (error) {
        console.error('Unexpected error:', error);
        return null;
      }
    },
    enabled: !!user,
  });

  // Update user behavioral profile
  const updateBehaviorProfile = useMutation({
    mutationFn: async (profileData: Partial<BehaviorProfile>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_behavior_profiles' as any)
        .upsert({
          user_id: user.id,
          ...profileData,
        });
      
      if (error) throw error;
      return data;
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
