
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { CareerRecommendation, ImplementationPlan } from '@/types/career';

export function useImplementationPlans() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create an implementation plan for a recommendation
  const createImplementationPlan = async (recommendationId: string): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to implement recommendations'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      // First update the recommendation status to implemented
      const { error: updateError } = await supabase
        .from('career_recommendations')
        .update({ status: 'implemented' })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Then fetch the recommendation details
      const { data: recommendation, error: fetchError } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single();

      if (fetchError) throw fetchError;

      // Create implementation plan based on recommendation type
      const typedRecommendation = {
        ...recommendation,
        type: recommendation.type as 'skill_gap' | 'job_match' | 'mentor_suggest'
      };
      
      const planTitle = `Plan for ${
        typedRecommendation.type === 'skill_gap' ? 'Skill Development' : 
        typedRecommendation.type === 'job_match' ? 'Career Transition' : 
        'Finding Mentorship'
      }`;

      const { error: planError } = await supabase
        .from('user_implementation_plans')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          title: planTitle,
          status: 'in_progress',
          steps: generateImplementationSteps(typedRecommendation),
        });

      if (planError) throw planError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error implementing recommendation'));
      console.error('Error implementing recommendation:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Generate implementation steps based on recommendation type
  const generateImplementationSteps = (recommendation: CareerRecommendation) => {
    switch (recommendation.type) {
      case 'skill_gap':
        return [
          { step: 1, title: "Research courses", completed: false },
          { step: 2, title: "Enroll in relevant training", completed: false },
          { step: 3, title: "Complete initial assessment", completed: false },
          { step: 4, title: "Apply new skills in projects", completed: false }
        ];
      case 'job_match':
        return [
          { step: 1, title: "Update resume with relevant skills", completed: false },
          { step: 2, title: "Research target companies", completed: false },
          { step: 3, title: "Connect with professionals in field", completed: false },
          { step: 4, title: "Apply to suggested positions", completed: false }
        ];
      case 'mentor_suggest':
        return [
          { step: 1, title: "Review potential mentors", completed: false },
          { step: 2, title: "Prepare mentorship goals", completed: false },
          { step: 3, title: "Send mentorship request", completed: false },
          { step: 4, title: "Schedule first meeting", completed: false }
        ];
      default:
        return [
          { step: 1, title: "Review recommendation details", completed: false },
          { step: 2, title: "Create action steps", completed: false },
          { step: 3, title: "Set timeline for completion", completed: false }
        ];
    }
  };

  // Get implementation plans for the user
  const getImplementationPlans = async (): Promise<ImplementationPlan[]> => {
    if (!user) {
      setError(new Error('You must be logged in to view implementation plans'));
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_implementation_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ImplementationPlan[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching implementation plans'));
      console.error('Error fetching implementation plans:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createImplementationPlan,
    getImplementationPlans,
    loading,
    error
  };
}
