
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
  skills?: { name: string };
  activity_type?: string;
  created_at?: string;
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
  // Add other properties as needed
}
