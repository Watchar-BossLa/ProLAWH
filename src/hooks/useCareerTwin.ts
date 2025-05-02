
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCareerRecommendations } from '@/hooks/useCareerRecommendations';
import { useCareerRecommendationGenerator } from '@/hooks/useCareerRecommendationGenerator';
import { useImplementationPlans } from '@/hooks/useImplementationPlans';
import { CareerRecommendation, ImplementationPlan } from '@/types/career';

export type { CareerRecommendation, ImplementationPlan };

export function useCareerTwin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    getRecommendations, 
    updateRecommendationStatus,
    loading: recommendationsLoading,
    error: recommendationsError 
  } = useCareerRecommendations();
  
  const { 
    generateRecommendation,
    isGenerating,
    error: generationError 
  } = useCareerRecommendationGenerator();
  
  const { 
    createImplementationPlan,
    getImplementationPlans,
    loading: implementationLoading,
    error: implementationError 
  } = useImplementationPlans();

  // Add a recommendation
  const addRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecommendation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error generating recommendation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Implement a recommendation by creating an implementation plan
  const implementRecommendation = async (recommendationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await createImplementationPlan(recommendationId);
      if (!success) {
        throw new Error('Failed to create implementation plan');
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error implementing recommendation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Combine errors from all hooks
  useEffect(() => {
    const currentError = recommendationsError || generationError || implementationError;
    if (currentError) {
      setError(currentError);
    }
  }, [recommendationsError, generationError, implementationError]);

  // Combine loading states from all hooks
  useEffect(() => {
    const isCurrentlyLoading = recommendationsLoading || isGenerating || implementationLoading;
    setLoading(isCurrentlyLoading);
  }, [recommendationsLoading, isGenerating, implementationLoading]);

  return {
    loading,
    error,
    getRecommendations,
    updateRecommendationStatus,
    implementRecommendation,
    addRecommendation
  };
}
