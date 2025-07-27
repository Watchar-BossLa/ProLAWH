
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type EnrollParams = {
  courseId?: string;
  learningPathId?: string;
};

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useEnrollment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const enrollMutation = useMutation({
    mutationFn: async ({ courseId, learningPathId }: EnrollParams) => {
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
      queryClient.invalidateQueries({ queryKey: ["learning-path-enrollment"] });
      queryClient.invalidateQueries({ queryKey: ["user-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["learning-paths"] });
    }
  });

  const enroll = (params: EnrollParams, callbacks?: MutationCallbacks) => {
    return enrollMutation.mutate(params, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error: any) => {
        callbacks?.onError?.(error);
      }
    });
  };

  return { 
    enroll,
    isEnrolling: enrollMutation.isPending 
  };
}
