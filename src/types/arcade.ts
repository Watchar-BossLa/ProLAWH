export interface ChallengeValidationRules {
  required_items: string[];
  min_confidence?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: "ar" | "camera" | "code" | "quiz";
  difficulty_level: "beginner" | "intermediate" | "advanced";
  points: number;
  time_limit: number;
  instructions: string;
  validation_rules: ChallengeValidationRules;
}

export interface ChallengeResult {
  success: boolean;
  points: number;
  message: string;
}

export interface ChallengeContainerProps {
  challenge: Challenge;
  userId: string;
  onReturn: () => void;
}
