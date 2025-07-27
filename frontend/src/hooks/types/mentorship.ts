
export interface MentorProfile {
  id: string;
  userId: string;
  expertise: string[];
  yearsOfExperience: number;
  bio?: string;
  maxMentees: number;
  isAcceptingMentees: boolean;
  availability?: string;
}

export interface MentorshipRequest {
  id?: string;
  requester_id: string;
  mentor_id: string;
  message: string;
  status: string;
  created_at?: string;
  focus_areas?: string[];
  industry: string;
  expected_duration?: string;
  goals?: string[];
}

export interface MentorshipRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: string;
  focus_areas?: string[];
  goals?: string;
  meeting_frequency?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
  end_date?: string;
}

export interface MentorshipSession {
  id: string;
  relationship_id: string;
  scheduled_for: string;
  duration_minutes?: number;
  status: string;
  notes?: string;
  mentor_feedback?: string;
  mentee_feedback?: string;
  mentor_rating?: number;
  mentee_rating?: number;
}

export interface MentorshipProgress {
  id: string;
  mentorship_id: string;
  milestone: string;
  notes?: string;
  completed: boolean;
  date: string;
}

export interface MentorshipResource {
  id: string;
  mentorship_id: string;
  title: string;
  type: string;
  url?: string;
  description?: string;
  added_by: string;
  added_at: string;
  completed?: boolean;
}
