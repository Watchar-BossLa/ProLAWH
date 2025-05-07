
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Handle the case where the data might not have courses property
interface EnrollmentData {
  id: string;
  progress_percentage?: number;
  courses?: any[];
  [key: string]: any;
}

export function useLearningData() {
  const { user } = useAuth();
  
  // Fetch courses
  const { data: featuredCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Fetch learning paths
  const { data: learningPaths, isLoading: pathsLoading } = useQuery({
    queryKey: ["learning-paths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Fetch user enrollments if logged in
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_enrollments")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
  
  // Get in-progress courses
  const inProgressCourses = enrollments?.filter(
    (enrollment) => {
      const courses = (enrollment as EnrollmentData).courses || [];
      return Array.isArray(courses) && courses.length > 0;
    }
  ) || [];
  
  return {
    featuredCourses,
    learningPaths,
    enrollments,
    inProgressCourses,
    isLoading: coursesLoading || pathsLoading || enrollmentsLoading,
  };
}
