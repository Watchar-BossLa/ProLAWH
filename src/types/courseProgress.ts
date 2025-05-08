
export interface CourseProgress {
  id: string;
  user_id?: string;
  course_id?: string;
  completed_content_ids?: string[];
  last_accessed_at?: string;
  completed_at?: string | null;
  overall_progress?: number;
}

export interface MarkContentCompletedOptions {
  contentId: string;
}
