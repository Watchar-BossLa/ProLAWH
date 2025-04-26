
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useEnrollment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const enrollMutation = useMutation({
    mutationFn: async ({ courseId, learningPathId }: { courseId?: string; learningPathId?: string }) => {
      if (!user?.id) {
        throw new Error("You must be logged in to enroll");
      }

      const { error } = await supabase.from("user_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        learning_path_id: learningPathId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
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
