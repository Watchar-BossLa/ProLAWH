export interface DSPySignature {
  input_fields: Record<string, string>;
  output_fields: Record<string, string>;
  instruction: string;
}

export interface DSPyModule {
  name: string;
  signature: DSPySignature;
  examples?: Array<Record<string, any>>;
  config?: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
  };
}

export interface DSPyOptimizationResult {
  optimized_prompts: string[];
  performance_score: number;
  optimization_metrics: {
    accuracy?: number;
    consistency?: number;
    response_quality?: number;
  };
}

export interface DSPyTrainingExample {
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  expected_outputs?: Record<string, any>;
  metadata?: Record<string, any>;
}

// DSPy Signature Classes for different agent types
export interface CareerAdviceSignature extends DSPySignature {
  input_fields: {
    user_profile: string;
    career_goals: string;
    current_skills: string;
    context: string;
  };
  output_fields: {
    advice: string;
    action_items: string;
    resources: string;
    confidence: string;
  };
}

export interface SkillAssessmentSignature extends DSPySignature {
  input_fields: {
    skill_domain: string;
    user_experience: string;
    assessment_data: string;
    learning_preferences: string;
  };
  output_fields: {
    skill_level: string;
    gap_analysis: string;
    learning_path: string;
    recommendations: string;
  };
}

export interface SwarmCoordinationSignature extends DSPySignature {
  input_fields: {
    task_description: string;
    participating_agents: string;
    coordination_strategy: string;
    context: string;
  };
  output_fields: {
    coordination_plan: string;
    agent_assignments: string;
    success_metrics: string;
    monitoring_strategy: string;
  };
}

export interface ReasoningChainSignature extends DSPySignature {
  input_fields: {
    problem: string;
    context: string;
    agent_type: string;
    domain_knowledge: string;
  };
  output_fields: {
    reasoning_steps: string;
    conclusion: string;
    confidence_score: string;
    validation_criteria: string;
  };
}