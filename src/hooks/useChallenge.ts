
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
        // Ensure validation_rules is properly typed and has required_items
        const validationRules = data.validation_rules as any;
        
        // Check if validation_rules has the required structure
        if (!validationRules.required_items) {
          console.error('Invalid validation_rules structure:', validationRules);
          return; // Don't set the challenge if validation rules are incorrect
        }
        
        // Validate type and difficulty_level against allowed values
        const type = validateChallengeType(data.type);
        const difficultyLevel = validateDifficultyLevel(data.difficulty_level);
        
        if (!type || !difficultyLevel) {
          console.error('Invalid challenge type or difficulty level', { type: data.type, difficulty: data.difficulty_level });
          return; // Don't set the challenge if type/difficulty are incorrect
        }
        
        // Create a properly typed Challenge object
        const typedChallenge: Challenge = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: type,
          difficulty_level: difficultyLevel,
          points: data.points,
          time_limit: data.time_limit,
          instructions: data.instructions,
          validation_rules: validationRules as ChallengeValidationRules
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

// Helper function to validate challenge type
function validateChallengeType(type: string): "ar" | "camera" | "code" | "quiz" | undefined {
  const validTypes = ["ar", "camera", "code", "quiz"] as const;
  return validTypes.includes(type as any) ? type as "ar" | "camera" | "code" | "quiz" : undefined;
}

// Helper function to validate difficulty level
function validateDifficultyLevel(level: string): "beginner" | "intermediate" | "advanced" | undefined {
  const validLevels = ["beginner", "intermediate", "advanced"] as const;
  return validLevels.includes(level as any) ? level as "beginner" | "intermediate" | "advanced" : undefined;
}
