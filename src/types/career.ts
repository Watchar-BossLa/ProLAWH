
export interface CareerRecommendation {
  id: string;
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
  skills?: string[];
  resources?: {
    type: string;
    url?: string;
    title: string;
  }[];
}

export interface ImplementationPlan {
  id: string;
  user_id: string;
  recommendation_id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  steps: Array<{
    step: number;
    title: string;
    completed: boolean;
  }>;
  created_at: string;
  updated_at: string;
}
