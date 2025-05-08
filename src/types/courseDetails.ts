
import { ContentType, CourseContent, CourseInstructor, CourseModule, CourseReview, EnrollmentStatus } from "@/types/learning";

// Define minimal types for the database entities
export interface Course {
  id: string;
  title: string;
  description?: string;
  difficulty_level: string;
  estimated_duration?: string;
  created_by?: string;
  cover_image?: string;
  [key: string]: any;
}

export interface CourseContentData {
  id: string;
  course_id: string;
  title: string;
  content_type: ContentType;
  content: string;
  order: number;
  module_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
