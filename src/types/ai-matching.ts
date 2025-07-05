
// Types for AI Matching functionality
export interface BehaviorProfile {
  id: string;
  user_id: string;
  work_style_preferences: Record<string, any>;
  collaboration_preferences: Record<string, any>;
  learning_preferences: Record<string, any>;
  career_goals: Record<string, any>;
  risk_tolerance: number;
  flexibility_score: number;
  communication_style: string;
  preferred_project_duration: string[];
  industry_preferences: string[];
  location_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserSkillEnhanced {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number;
  years_experience: number;
  verification_status: 'verified' | 'pending' | 'unverified';
  endorsement_count: number;
  last_used_date: string | null;
  acquired_date: string | null;
  learning_path_id: string | null;
  created_at: string;
  updated_at: string;
  skill?: {
    id: string;
    name: string;
    category: string;
  };
}

export interface OpportunityMatch {
  id: string;
  user_id: string;
  opportunity_id: string;
  match_score: number;
  skill_compatibility: Record<string, any>;
  experience_fit: number;
  cultural_fit: number;
  compensation_alignment: number;
  success_prediction: number;
  reasoning: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MarketIntelligence {
  id: string;
  skill_id: string;
  region: string;
  demand_score: number;
  supply_score: number;
  avg_rate_usd: number;
  trend_direction: 'rising' | 'stable' | 'declining';
  forecast_data: Record<string, any>;
  data_source: string;
  collected_at: string;
  created_at: string;
  skill?: {
    id: string;
    name: string;
    category: string;
  };
}
