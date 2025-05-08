
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseInstructor } from "@/types/learning";

export function useCourseInstructor(createdBy: string | undefined) {
  const { data: instructor, isLoading } = useQuery({
    queryKey: ["course-instructor", createdBy],
    queryFn: async () => {
      if (!createdBy) return null;
      
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
    enabled: !!createdBy,
  });

  return { instructor, isLoading };
}
