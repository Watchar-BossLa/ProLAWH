
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, ChallengeValidationRules } from '@/types/arcade';

export function useChallenge(challengeId: string | undefined) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;
      
      const { data, error } = await supabase
        .from('arcade_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!error && data) {
        // Ensure validation_rules matches the expected type
        const validationRules = data.validation_rules as ChallengeValidationRules;
        
        // Create a properly typed Challenge object
        const typedChallenge: Challenge = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type,
          difficulty_level: data.difficulty_level,
          points: data.points,
          time_limit: data.time_limit,
          instructions: data.instructions,
          validation_rules: validationRules
        };
        
        setChallenge(typedChallenge);
      }
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user.id || null);
    };

    fetchChallenge();
    checkAuth();
  }, [challengeId]);

  return { challenge, userId };
}
