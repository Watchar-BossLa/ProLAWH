
// Define a comprehensive MockData interface to avoid type errors when accessing properties
export interface MockData {
  id: string;
  name?: string;
  user_id?: string;
  skill_id?: string;
  issued_at?: string;
  expires_at?: string | null;
  metadata?: Record<string, any> | null;
  is_verified?: boolean;
  credential_type?: string;
  credential_hash?: string;
  transaction_id?: string;
  skills?: { name: string } | string[];
  activity_type?: string;
  created_at?: string;
  updated_at?: string;
  type?: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation?: string;
  relevance_score?: number;
  status?: string;
  expertise?: string[];
  profiles?: { full_name: string; avatar_url: string };
  years_of_experience?: number;
  bio?: string;
  availability?: string;
  is_accepting_mentees?: boolean;
  completed_content_ids?: string[];
  completed_at?: string | null;
  courses?: any[];
  mentorId?: string;
  mentorName?: string;
  mentorExpertise?: string[];
  matchReason?: string;
  recommendationId?: string;
  reason?: string;
  score?: number;
  progress_percentage?: number;
  content_type?: string;
  course_id?: string;
  order?: number;
  module_id?: string;
  content?: string;
  description?: string;
  title?: string;
  mentor_id?: string;
  mentee_id?: string;
  focus_areas?: string[];
  goals?: string[] | string;
  metric_name?: string;
  metric_value?: number;
  role?: string;
  full_name?: string;
  location?: string;
  payment_method?: string;
  payment_date?: string;
  amount?: number;
  badge_id?: string;
  requester_id?: string;
  industry?: string;
  expected_duration?: string;
  createdAt?: string;
  focusAreas?: string[];
}

// Define an interface for mentor recommendation data structure
export interface MentorRecommendation {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorExpertise: string[];
  matchReason: string;
  relevanceScore: number;
  recommendationId?: string;
  reason?: string;
  score?: number;
}

// Define an interface for activity logs
export interface ActivityLog {
  id: string;
  activity_type: string;
  created_at: string;
  user_id: string;
  metadata?: Record<string, any>;
}

// Define an interface for mentorship requests
export interface MentorshipRequest {
  id: string;
  mentorId: string;
  requesterId: string;
  message: string;
  status: string;
  focusAreas: string[];
  industry?: string;
  expectedDuration?: string;
  goals?: string[];
  createdAt: string;
  mentor_id?: string;
  requester_id?: string;
  focus_areas?: string[];
}
