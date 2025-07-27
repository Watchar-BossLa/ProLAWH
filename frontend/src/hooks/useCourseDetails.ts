
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { CourseInstructor, CourseModule, CoursePrerequisite, CourseReview, CourseContent, EnrollmentStatus, ContentType } from "@/types/learning";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type CourseContentFromDB = Database["public"]["Tables"]["course_contents"]["Row"];

export function useCourseDetails(courseId: string) {
  const { user } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });

  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["course-contents", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_contents")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });
      
      if (error) throw error;
      
      // Transform data to ensure it has all required properties
      return data.map((content: CourseContentFromDB & { module_id?: string }) => ({
        ...content,
        content_type: content.content_type as ContentType,
        module_id: content.module_id || "default" // Ensure module_id exists with a default value
      })) as CourseContent[];
    },
    enabled: !!courseId,
  });

  // Fetch instructor information
  const { data: instructor, isLoading: instructorLoading } = useQuery({
    queryKey: ["course-instructor", courseId],
    queryFn: async () => {
      if (!course?.created_by) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", course.created_by)
        .single();
      
      if (error) return null;
      
      return {
        id: data.id,
        name: data.full_name || "Anonymous",
        title: "Course Instructor",
        bio: data.bio || "No bio available",
        avatar_url: data.avatar_url || "/placeholder.svg"
      } as CourseInstructor;
    },
    enabled: !!course?.created_by,
  });

  // Fetch enrollment status for current user
  const { data: enrollmentStatus, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment-status", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return { is_enrolled: false, progress_percentage: 0, completed_content_ids: [] };

      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("user_enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (enrollmentError || !enrollmentData) {
        return { is_enrolled: false, progress_percentage: 0, completed_content_ids: [] };
      }

      const { data: progressData, error: progressError } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (progressError || !progressData) {
        return { 
          is_enrolled: true, 
          progress_percentage: enrollmentData.progress_percentage || 0,
          completed_content_ids: []
        };
      }

      return {
        is_enrolled: true,
        progress_percentage: progressData.overall_progress,
        last_content_id: progressData.completed_content_ids[progressData.completed_content_ids.length - 1],
        completed_content_ids: progressData.completed_content_ids
      } as EnrollmentStatus;
    },
    enabled: !!courseId && !!user?.id,
  });

  // Use mock data for course reviews instead of attempting to query non-existent table
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      // Return mock data
      return [
        {
          id: "1",
          user_id: "user1",
          username: "John Doe",
          avatar_url: "/placeholder.svg",
          rating: 5,
          comment: "Great course! Very informative.",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          user_id: "user2",
          username: "Jane Smith",
          avatar_url: "/placeholder.svg",
          rating: 4,
          comment: "I learned a lot from this course.",
          created_at: new Date().toISOString()
        }
      ] as CourseReview[];
    },
    enabled: !!courseId,
  });

  // Organize contents into modules
  const modules = contents ? organizeContentIntoModules(contents) : [];

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    course,
    contents,
    modules,
    instructor,
    enrollmentStatus,
    reviews,
    averageRating,
    isLoading: courseLoading || contentsLoading || instructorLoading || enrollmentLoading || reviewsLoading,
  };
}

// Helper function to organize contents into modules
function organizeContentIntoModules(contents: CourseContent[]): CourseModule[] {
  const moduleMap: Record<string, CourseModule> = {};
  
  // Group contents by their module_id or create a default module
  contents.forEach((content) => {
    const moduleId = content.module_id || 'default';
    
    if (!moduleMap[moduleId]) {
      moduleMap[moduleId] = {
        id: moduleId,
        title: moduleId === 'default' ? 'Course Content' : `Module ${Object.keys(moduleMap).length + 1}`,
        order: Object.keys(moduleMap).length,
        contents: []
      };
    }
    
    moduleMap[moduleId].contents.push(content);
  });
  
  // Sort modules by order
  return Object.values(moduleMap).sort((a, b) => a.order - b.order);
}
