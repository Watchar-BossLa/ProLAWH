import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CourseInstructor, CourseModule, CoursePrerequisite, CourseReview, CourseContent, EnrollmentStatus, ContentType } from "@/types/learning";

// Define minimal types for the database entities we're dealing with
interface Course {
  id: string;
  title: string;
  description?: string;
  difficulty_level: string;
  estimated_duration?: string;
  created_by?: string;
  [key: string]: any;
}

interface CourseContentData {
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

export function useCourseDetails(courseId: string) {
  const { user } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");
      
      if (error) throw error;
      // Return the first course or create a mock one
      return (data && data.length > 0 ? data[0] : {
        id: courseId,
        title: "Mock Course",
        description: "Mock Description",
        difficulty_level: "intermediate",
        estimated_duration: "2 hours"
      }) as Course;
    },
    enabled: !!courseId,
  });

  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["course-contents", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_contents")
        .select("*");
      
      if (error) throw error;
      
      // Mock data if empty - ensure types are correct
      const mockContents: CourseContentData[] = data && data.length > 0 ? data : [
        {
          id: "content-1",
          course_id: courseId,
          title: "Introduction",
          content_type: "video" as ContentType,
          content: "https://example.com/video.mp4",
          order: 1,
          module_id: "module-1",
          description: "Introduction to the course",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "content-2",
          course_id: courseId,
          title: "Lesson 1",
          content_type: "text" as ContentType,
          content: "This is lesson 1 content",
          order: 2,
          module_id: "module-1",
          description: "First lesson content",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Transform data to ensure it has all required properties
      return mockContents.map((content) => ({
        ...content,
        content_type: content.content_type as ContentType,
        module_id: content.module_id || "default", // Ensure module_id exists with a default value
        description: content.description || null,
        created_at: content.created_at || new Date().toISOString(),
        updated_at: content.updated_at || new Date().toISOString()
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
        .select("*");
      
      if (error) return null;
      
      // Mock instructor data
      const mockInstructor = {
        id: "mock-instructor-id",
        name: "Dr. Jane Smith",
        title: "Course Instructor",
        bio: "Expert in sustainable development and green technologies",
        avatar_url: "/placeholder.svg"
      };
      
      return mockInstructor as CourseInstructor;
    },
    enabled: !!course?.created_by,
  });

  // Fetch enrollment status for current user
  const { data: enrollmentStatus, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment-status", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return { is_enrolled: false, progress_percentage: 0, completed_content_ids: [] };

      // Mock enrollment data
      const mockEnrollmentStatus = {
        is_enrolled: true,
        progress_percentage: 35,
        last_content_id: "content-1",
        completed_content_ids: ["content-1"]
      };

      // Mock progress data
      const mockProgressData = {
        overall_progress: 35,
        completed_content_ids: ["content-1"],
      };

      return {
        is_enrolled: true,
        progress_percentage: mockProgressData.overall_progress,
        last_content_id: mockProgressData.completed_content_ids[mockProgressData.completed_content_ids.length - 1],
        completed_content_ids: mockProgressData.completed_content_ids
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
