
export type ContentType = 'video' | 'article' | 'quiz' | 'assignment' | 'discussion';

export interface CourseInstructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
}

export interface CoursePrerequisite {
  id: string;
  title: string;
  description?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  contents: CourseContent[];
}

export interface CourseContent {
  id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  content: string;
  order: number;
  duration?: string;
  is_preview?: boolean;
  module_id?: string;
}

export interface CourseReview {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface UserNote {
  id: string;
  content_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentStatus {
  is_enrolled: boolean;
  progress_percentage: number;
  last_content_id?: string;
  completed_content_ids: string[];
}
