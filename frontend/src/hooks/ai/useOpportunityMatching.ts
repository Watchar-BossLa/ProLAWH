
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from './useUserSkills';
import { useBehaviorProfile } from './useBehaviorProfile';
import type { OpportunityMatch, UserSkillEnhanced } from '@/types/ai-matching';

export function useOpportunityMatching() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { userSkills } = useUserSkills();
  const { behaviorProfile } = useBehaviorProfile();

  // Fetch AI-generated opportunity matches
  const { data: opportunityMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['opportunity-matches', user?.id],
    queryFn: async (): Promise<OpportunityMatch[]> => {
      if (!user) return [];
      
      try {
        // Since opportunity_matches table doesn't exist, return mock data for now
        // In production, this would query the actual opportunity matches table
        const mockMatches: OpportunityMatch[] = [
          {
            id: '1',
            user_id: user.id,
            opportunity_id: '1',
            match_score: 0.85,
            skill_compatibility: {
              matched_skills: ['React', 'TypeScript'],
              missing_skills: ['Node.js'],
              proficiency_scores: { 'React': 8, 'TypeScript': 7 },
              score: 0.8
            },
            experience_fit: 0.9,
            cultural_fit: 0.8,
            compensation_alignment: 0.85,
            success_prediction: 0.82,
            reasoning: {
              primary_strengths: ['Strong technical skills', 'Good experience match'],
              concerns: ['Minor skill gaps'],
              recommendations: ['Consider learning Node.js']
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        return mockMatches;
      } catch (error) {
        console.error('Error fetching opportunity matches:', error);
        return [];
      }
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
      
      const matches: OpportunityMatch[] = [];
      
      for (const opportunity of opportunities) {
        // Calculate individual match components
        const skillMatch = calculateSkillMatch(userSkills, opportunity.skills_required || []);
        
        // Experience fit based on years and role level
        const experienceFit = Math.min(1, 
          (userSkills.reduce((acc, s) => acc + (s.years_experience || 0), 0) / userSkills.length) / 5
        );
        
        // Cultural fit based on behavior profile (simplified)
        const culturalFit = behaviorProfile ? 
          (behaviorProfile.flexibility_score + behaviorProfile.risk_tolerance) / 2 : 0.5;
        
        // Compensation alignment (mock calculation)
        const compensationFit = opportunity.rate_range ? 
          Math.random() * 0.4 + 0.6 : 0.7; // Mock for now
        
        // Overall match score with weighted components
        const matchScore = (
          skillMatch * 0.4 +
          experienceFit * 0.2 +
          culturalFit * 0.2 +
          compensationFit * 0.2
        );
        
        // Success prediction based on historical data (mock)
        const successPrediction = matchScore * (0.8 + Math.random() * 0.2);
        
        const match: OpportunityMatch = {
          id: crypto.randomUUID(),
          user_id: user.id,
          opportunity_id: opportunity.id,
          match_score: Math.round(matchScore * 100) / 100,
          skill_compatibility: {
            matched_skills: opportunity.skills_required?.filter((skill: string) =>
              userSkills.some(us => us.skill?.name.toLowerCase() === skill.toLowerCase())
            ) || [],
            missing_skills: opportunity.skills_required?.filter((skill: string) =>
              !userSkills.some(us => us.skill?.name.toLowerCase() === skill.toLowerCase())
            ) || [],
            proficiency_scores: {},
            score: skillMatch
          },
          experience_fit: Math.round(experienceFit * 100) / 100,
          cultural_fit: Math.round(culturalFit * 100) / 100,
          compensation_alignment: Math.round(compensationFit * 100) / 100,
          success_prediction: Math.round(successPrediction * 100) / 100,
          reasoning: {
            primary_strengths: skillMatch > 0.7 ? ['Strong skill alignment'] : [],
            concerns: skillMatch < 0.5 ? ['Skill gap identified'] : [],
            recommendations: experienceFit < 0.5 ? ['Consider gaining more experience'] : []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        matches.push(match);
      }
      
      // In production, store matches in database
      console.log('Generated matches:', matches);
      
      setIsAnalyzing(false);
      return matches;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-matches'] });
    },
  });

  return {
    opportunityMatches,
    matchesLoading,
    isAnalyzing,
    generateMatches: generateMatches.mutate,
    calculateSkillMatch,
  };
}
