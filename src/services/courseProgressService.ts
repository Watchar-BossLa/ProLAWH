
import { supabase } from "@/integrations/supabase/client";
import { CourseProgress } from "@/types/courseProgress";

export async function getExistingProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
  const { data: existingProgress, error: checkError } = await supabase
    .from("course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }
  
  return existingProgress && existingProgress.length > 0 
    ? existingProgress[0] as CourseProgress
    : null;
}

export async function updateCourseProgress(
  progressId: string, 
  updates: Partial<CourseProgress>
): Promise<CourseProgress> {
  const { data, error } = await supabase
    .from("course_progress")
    .update(updates)
    .eq("id", progressId);

  if (error) throw error;
  
  // Return mock response since we're using mock data anyway
  return {
    id: progressId,
    ...updates
  } as CourseProgress;
}

export async function createCourseProgress(
  userId: string,
  courseId: string,
  contentId: string,
  overallProgress: number
): Promise<CourseProgress> {
  const { data, error } = await supabase
    .from("course_progress")
    .insert({
      user_id: userId,
      course_id: courseId,
      completed_content_ids: [contentId],
      overall_progress: overallProgress,
    });

  if (error) throw error;
  
  // Return mock response
  return {
    id: 'mock-id',
    user_id: userId,
    course_id: courseId,
    completed_content_ids: [contentId],
    overall_progress: overallProgress
  };
}

export async function getTotalContentCount(courseId: string): Promise<number> {
  // In a real app, this would fetch the actual count from the database
  // For now, we'll use a mock value
  return 10;
}
