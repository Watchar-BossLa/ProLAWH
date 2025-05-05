
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty_level: string;
  points: number;
  time_limit: number;
  instructions: string;
  validation_rules: Record<string, any>;
}

export function useChallenge() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenges = async (type?: string, difficulty?: string) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supabase.functions.invoke('arcade-challenges', {
        body: { action: 'list', type, difficulty }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      // Access the mock data with expected structure
      const mockData: ChallengeData = {
        id: "mock-id",
        title: "Mock Title",
        description: "Mock Description",
        type: "mock-type",
        difficulty_level: "beginner",
        points: 100,
        time_limit: 30,
        instructions: "Mock Instructions",
        validation_rules: {}
      };
      
      setChallenges([mockData]);
      return [mockData];
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Error fetching challenges: ${errorMessage}`));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getChallenge = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await supabase.functions.invoke('arcade-challenges', {
        body: { action: 'get', id }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      // Return a mock challenge with the correct structure
      return {
        id: "mock-id",
        title: "Mock Title",
        description: "Mock Description",
        type: "mock-type",
        difficulty_level: "beginner",
        points: 100,
        time_limit: 30,
        instructions: "Mock Instructions",
        validation_rules: {}
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(`Error fetching challenge: ${errorMessage}`));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    challenges,
    isLoading,
    error,
    fetchChallenges,
    getChallenge
  };
}
