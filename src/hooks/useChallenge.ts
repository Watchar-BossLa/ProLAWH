
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, ChallengeValidationRules, Question } from '@/types/arcade';

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
        // Ensure validation_rules is properly typed
        const validationRules = data.validation_rules as any;
        
        // Validate type and difficulty_level against allowed values
        const type = validateChallengeType(data.type);
        const difficultyLevel = validateDifficultyLevel(data.difficulty_level);
        
        if (!type || !difficultyLevel) {
          console.error('Invalid challenge type or difficulty level', { type: data.type, difficulty: data.difficulty_level });
          return; // Don't set the challenge if type/difficulty are incorrect
        }

        // Process questions if available
        let questions: Question[] | undefined = undefined;
        
        if (data.type === 'quiz' && data.questions && Array.isArray(data.questions)) {
          questions = data.questions.map((q: any) => {
            if (q.id && q.text && q.type) {
              // Ensure type is one of the allowed values
              const validatedType = validateQuestionType(q.type);
              return {
                id: q.id,
                text: q.text,
                type: validatedType,
                options: Array.isArray(q.options) ? q.options : undefined
              };
            }
            return null;
          }).filter(Boolean) as Question[];
          
          if (questions.length === 0) {
            questions = undefined;
          }
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
          validation_rules: {
            required_items: validationRules.required_items || [],
            min_confidence: validationRules.min_confidence,
            correct_answers: validationRules.correct_answers || {},
            test_cases: validationRules.test_cases || [],
          },
          questions
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

// Helper function to validate question type
function validateQuestionType(type: string): "multiple-choice" | "text" | "code" {
  const validTypes = ["multiple-choice", "text", "code"] as const;
  return validTypes.includes(type as any) ? type as "multiple-choice" | "text" | "code" : "multiple-choice";
}
