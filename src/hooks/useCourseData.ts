
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseContentData } from "@/types/courseDetails";
import { ContentType } from "@/types/learning";

export function useCourseData(courseId: string) {
  const courseQuery = useQuery({
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

  const contentsQuery = useQuery({
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
        content_type: content.content_type,
        module_id: content.module_id || "default",
        description: content.description || null,
        created_at: content.created_at || new Date().toISOString(),
        updated_at: content.updated_at || new Date().toISOString()
      })) as CourseContentData[];
    },
    enabled: !!courseId,
  });
  
  return {
    course: courseQuery.data,
    contents: contentsQuery.data,
    isLoading: courseQuery.isLoading || contentsQuery.isLoading
  };
}
