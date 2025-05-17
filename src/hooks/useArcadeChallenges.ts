
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Challenge, Question } from "@/types/arcade";

export function useArcadeChallenges() {
  return useQuery({
    queryKey: ["arcade-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arcade_challenges")
        .select("*")
        .order("difficulty_level", { ascending: true });

      if (error) throw error;
      
      // Validate and transform the raw data
      const validatedChallenges = data.map((challenge: any): Challenge => {
        // Ensure validation_rules has the required structure
        const validationRules = challenge.validation_rules || {};
        
        // Process questions if available - questions are stored within validation_rules for quiz type challenges
        let questions: Question[] | undefined = undefined;
        
        if (challenge.type === 'quiz' && validationRules.questions && Array.isArray(validationRules.questions)) {
          questions = validationRules.questions.map((q: any) => {
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
        
        return {
          id: challenge.id,
          title: challenge.title || 'Untitled Challenge',
          description: challenge.description,
          difficulty_level: validateDifficultyLevel(challenge.difficulty_level) || 'beginner',
          points: Number(challenge.points) || 0,
          time_limit: Number(challenge.time_limit) || 60,
          type: validateChallengeType(challenge.type) || 'camera',
          instructions: challenge.instructions || 'Complete the challenge',
          validation_rules: {
            required_items: validationRules.required_items || [],
            min_confidence: validationRules.min_confidence,
            correct_answers: validationRules.correct_answers || {},
            test_cases: validationRules.test_cases || [],
          },
          questions
        };
      });
      
      return validatedChallenges;
    },
  });
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
