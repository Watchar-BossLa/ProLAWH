
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useEnrollment() {
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: async ({ courseId, learningPathId }: { courseId?: string; learningPathId?: string }) => {
      const { error } = await supabase.from("user_enrollments").insert({
        course_id: courseId,
        learning_path_id: learningPathId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast({
        title: "Successfully enrolled",
        description: "You can now start learning!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to enroll",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { enroll: enrollMutation.mutate, isEnrolling: enrollMutation.isPending };
}
