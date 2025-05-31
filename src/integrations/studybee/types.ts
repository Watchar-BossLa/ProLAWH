
export interface StudyBeeSession {
  id: string;
  user_id: string;
  session_type: 'study' | 'quiz' | 'review' | 'collaboration';
  subject: string;
  duration_minutes: number;
  progress_percentage: number;
  notes_count: number;
  quiz_score?: number;
  started_at: string;
  completed_at?: string;
  metadata: {
    course_name?: string;
    chapter?: string;
    topics?: string[];
    ai_insights?: string[];
  };
}

export interface StudyBeeProgress {
  total_study_time: number;
  sessions_this_week: number;
  current_streak: number;
  longest_streak: number;
  subjects_studied: string[];
  achievements: string[];
  performance_metrics: {
    focus_score: number;
    retention_rate: number;
    quiz_average: number;
  };
}

export interface StudyBeeAuthToken {
  token: string;
  expires_at: string;
  user_id: string;
}
