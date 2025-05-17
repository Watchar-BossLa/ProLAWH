
export interface ChallengeValidationRules {
  required_items?: string[];
  min_confidence?: number;
  correct_answers?: Record<string, string | string[]>;
  test_cases?: TestCase[];
}

export interface TestCase {
  input: string;
  expected_output: string;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  type: "multiple-choice" | "text" | "code";
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
  questions?: Question[];
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
