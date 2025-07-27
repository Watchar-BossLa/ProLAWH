
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"] & {
  courses: Course[];
};
type UserEnrollment = Database["public"]["Tables"]["user_enrollments"]["Row"];

export function useLearningData() {
  const { user } = useAuth();

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: learningPaths, isLoading: pathsLoading } = useQuery({
    queryKey: ["learning-paths"],
    queryFn: async () => {
      const { data: paths, error: pathsError } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (pathsError) throw pathsError;

      // Fetch associated courses for each learning path
      const pathsWithCourses = await Promise.all(
        paths.map(async (path) => {
          const { data: pathCourses, error: coursesError } = await supabase
            .from("learning_path_courses")
            .select("courses(*)")
            .eq("learning_path_id", path.id)
            .order("sequence_order");

          if (coursesError) return { ...path, courses: [] };

          return {
            ...path,
            courses: pathCourses
              .map(pc => pc.courses)
              .filter((course): course is Course => course !== null)
          };
        })
      );

      return pathsWithCourses as LearningPath[];
    },
  });

  // Fetch user enrollments to track progress
  const { data: userEnrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_enrollments")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) throw error;
      return data as UserEnrollment[];
    },
    enabled: !!user?.id,
  });

  return {
    courses,
    learningPaths,
    userEnrollments,
    isLoading: coursesLoading || pathsLoading || enrollmentsLoading
  };
}
