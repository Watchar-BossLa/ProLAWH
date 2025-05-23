
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

interface EnrollmentStatus {
  is_enrolled: boolean;
  progress_percentage: number;
  last_content_id?: string;
}

export function useLearningPathDetails(pathId?: string) {
  const { user } = useAuth();

  const {
    data: learningPath,
    error: pathError,
    isLoading: pathLoading,
  } = useQuery({
    queryKey: ["learning-path", pathId],
    queryFn: async () => {
      if (!pathId) throw new Error("Learning path ID is required");

      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("id", pathId)
        .single();

      if (error) throw error;
      return data as LearningPath;
    },
    enabled: !!pathId,
  });

  const {
    data: courses,
    error: coursesError,
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["learning-path-courses", pathId],
    queryFn: async () => {
      if (!pathId) throw new Error("Learning path ID is required");

      // Get courses in this learning path
      const { data: pathCourses, error: coursesError } = await supabase
        .from("learning_path_courses")
        .select("courses(*)")
        .eq("learning_path_id", pathId)
        .order("sequence_order");

      if (coursesError) throw coursesError;

      // Transform the data to extract course objects
      return pathCourses
        .map(pc => pc.courses)
        .filter((course): course is Course => course !== null);
    },
    enabled: !!pathId,
  });

  const {
    data: enrollmentStatus,
    error: enrollmentError,
    isLoading: enrollmentLoading,
  } = useQuery({
    queryKey: ["learning-path-enrollment", pathId, user?.id],
    queryFn: async () => {
      if (!pathId || !user?.id) {
        return { is_enrolled: false, progress_percentage: 0 };
      }

      const { data, error } = await supabase
        .from("user_enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("learning_path_id", pathId)
        .single();

      if (error || !data) {
        return { is_enrolled: false, progress_percentage: 0 };
      }

      return {
        is_enrolled: true,
        progress_percentage: data.progress_percentage || 0,
      } as EnrollmentStatus;
    },
    enabled: !!pathId && !!user?.id,
  });

  // Get combined loading state and error
  const isLoading = pathLoading || coursesLoading || enrollmentLoading;
  const error = pathError || coursesError || enrollmentError;

  return {
    learningPath,
    courses,
    enrollmentStatus,
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
