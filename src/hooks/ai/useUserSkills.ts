
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { UserSkillEnhanced } from '@/types/ai-matching';

export function useUserSkills() {
  const { user } = useAuth();

  const { data: userSkills = [], isLoading } = useQuery({
    queryKey: ['user-skills-enhanced', user?.id],
    queryFn: async (): Promise<UserSkillEnhanced[]> => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('user_skills_enhanced' as any)
          .select(`
            *,
            skill:skills_taxonomy(*)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching user skills:', error);
          return [];
        }
        
        return (data || []) as UserSkillEnhanced[];
      } catch (error) {
        console.error('Unexpected error:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  return {
    userSkills,
    isLoading,
  };
}
