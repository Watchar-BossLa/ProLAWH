
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BehaviorProfile, UserSkillEnhanced, OpportunityMatch } from '@/types/ai-matching';

interface MatchingCriteria {
  skillWeights?: Record<string, number>;
  experienceWeight?: number;
  compensationWeight?: number;
  culturalFitWeight?: number;
  locationFlexibility?: number;
}

export function useAIMatching() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch user's behavioral profile
  const { data: behaviorProfile } = useQuery({
    queryKey: ['behavior-profile', user?.id],
    queryFn: async (): Promise<BehaviorProfile | null> => {
      if (!user) return null;
      
      // Create mock profile since table doesn't exist
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
    },
    enabled: !!user,
  });

  // Fetch user's enhanced skills
  const { data: userSkills } = useQuery({
    queryKey: ['user-skills-enhanced', user?.id],
    queryFn: async (): Promise<UserSkillEnhanced[]> => {
      if (!user) return [];
      
      // Create mock skills since table doesn't exist
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
        }
      ];
      
      return mockSkills;
    },
    enabled: !!user,
  });

  // Fetch AI-generated opportunity matches
  const { data: opportunityMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ['opportunity-matches', user?.id],
    queryFn: async (): Promise<OpportunityMatch[]> => {
      if (!user) return [];
      
      // Create mock matches since table doesn't exist
      const mockMatches: OpportunityMatch[] = [];
      
      return mockMatches;
    },
    enabled: !!user,
  });

  // Calculate skill compatibility score
  const calculateSkillMatch = useCallback((userSkills: UserSkillEnhanced[], opportunitySkills: string[]) => {
    if (!userSkills.length || !opportunitySkills.length) return 0;
    
    const userSkillNames = userSkills.map(s => s.skill?.name.toLowerCase()).filter(Boolean);
    const matchedSkills = opportunitySkills.filter(skill => 
      userSkillNames.includes(skill.toLowerCase())
    );
    
    const baseMatch = matchedSkills.length / opportunitySkills.length;
    
    // Weight by proficiency levels
    const proficiencyWeight = matchedSkills.reduce((acc, skill) => {
      const userSkill = userSkills.find(us => 
        us.skill?.name.toLowerCase() === skill.toLowerCase()
      );
      return acc + (userSkill?.proficiency_level || 5) / 10;
    }, 0) / matchedSkills.length;
    
    return Math.min(1, baseMatch * (proficiencyWeight || 0.5));
  }, []);

  // Generate AI matches for opportunities
  const generateMatches = useMutation({
    mutationFn: async (opportunities: any[]) => {
      if (!user || !userSkills) return [];
      
      setIsAnalyzing(true);
      
      // Mock generation logic
      console.log('Generating matches for opportunities:', opportunities);
      
      setIsAnalyzing(false);
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-matches'] });
    },
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
    // Data
    behaviorProfile,
    userSkills,
    opportunityMatches,
    
    // States
    isAnalyzing,
    matchesLoading,
    
    // Actions
    generateMatches: generateMatches.mutate,
    updateBehaviorProfile: updateBehaviorProfile.mutate,
    
    // Utilities
    calculateSkillMatch,
  };
}
