
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
        // Since user_skills_enhanced doesn't exist, create mock data for now
        // In production, this would query the actual user skills table
        const mockSkills: UserSkillEnhanced[] = [
          {
            id: '1',
            user_id: user.id,
            skill_id: '1',
            proficiency_level: 8,
            years_experience: 3,
            verification_status: 'verified',
            endorsement_count: 5,
            last_used_date: new Date().toISOString(),
            acquired_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
            learning_path_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            skill: {
              id: '1',
              name: 'React Development',
              category: 'Frontend'
            }
          },
          {
            id: '2',
            user_id: user.id,
            skill_id: '2',
            proficiency_level: 7,
            years_experience: 2,
            verification_status: 'verified',
            endorsement_count: 3,
            last_used_date: new Date().toISOString(),
            acquired_date: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
            learning_path_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            skill: {
              id: '2',
              name: 'TypeScript',
              category: 'Programming'
            }
          }
        ];
        
        return mockSkills;
      } catch (error) {
        console.error('Error fetching user skills:', error);
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
