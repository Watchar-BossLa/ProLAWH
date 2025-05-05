
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Challenge, Question } from "@/types/arcade";

export type ArcadeChallenge = Challenge;

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
        const requiredItems = validationRules.required_items || [];
        
        // Process questions if available
        const questions: Question[] = [];
        if (challenge.type === 'quiz' && Array.isArray(challenge.questions)) {
          challenge.questions.forEach((q: any) => {
            if (q.id && q.text && q.type) {
              questions.push(q);
            }
          });
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
            required_items: requiredItems,
            min_confidence: validationRules.min_confidence,
            correct_answers: validationRules.correct_answers || {},
            test_cases: validationRules.test_cases || [],
          },
          questions: questions.length > 0 ? questions : undefined
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
