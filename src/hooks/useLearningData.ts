
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"];

export function useLearningData() {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: learningPaths, isLoading: pathsLoading } = useQuery({
    queryKey: ["learning-paths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LearningPath[];
    },
  });

  return {
    courses,
    learningPaths,
    isLoading: coursesLoading || pathsLoading
  };
}
