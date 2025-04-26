
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type CourseContent = Database["public"]["Tables"]["course_contents"]["Row"];

export function useCourseDetails(courseId: string) {
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
      return data as CourseContent[];
    },
    enabled: !!courseId,
  });

  return {
    course,
    contents,
    isLoading: courseLoading || contentsLoading,
  };
}
