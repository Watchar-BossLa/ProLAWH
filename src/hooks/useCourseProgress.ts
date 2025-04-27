
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function useCourseProgress(courseId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const markContentAsCompleted = useMutation({
    mutationFn: async (contentId: string) => {
      if (!user?.id) {
        throw new Error("You must be logged in to track progress");
      }

      // Check if there's existing progress
      const { data: existingProgress, error: checkError } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      // Get total content count for percentage calculation
      const { count: totalContentCount, error: countError } = await supabase
        .from("course_contents")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId);

      if (countError) throw countError;
      
      if (existingProgress) {
        // Don't add if already completed
        if (existingProgress.completed_content_ids.includes(contentId)) {
          return existingProgress;
        }
        
        const updatedContentIds = [...existingProgress.completed_content_ids, contentId];
        const overallProgress = Math.round((updatedContentIds.length / (totalContentCount || 1)) * 100);
        
        // Update existing progress
        const { data, error } = await supabase
          .from("course_progress")
          .update({
            completed_content_ids: updatedContentIds,
            overall_progress: overallProgress,
            last_accessed_at: new Date().toISOString(),
            completed_at: overallProgress === 100 ? new Date().toISOString() : existingProgress.completed_at,
          })
          .eq("id", existingProgress.id)
          .select()
          .single();

        if (error) throw error;
        
        // Also update enrollment progress
        await supabase
          .from("user_enrollments")
          .update({
            progress_percentage: overallProgress,
            completed_at: overallProgress === 100 ? new Date().toISOString() : null,
          })
          .eq("user_id", user.id)
          .eq("course_id", courseId);
          
        return data;
      } else {
        // Create new progress entry
        const overallProgress = Math.round((1 / (totalContentCount || 1)) * 100);
        
        const { data, error } = await supabase
          .from("course_progress")
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed_content_ids: [contentId],
            overall_progress: overallProgress,
          })
          .select()
          .single();

        if (error) throw error;
        
        // Also update enrollment progress
        await supabase
          .from("user_enrollments")
          .update({
            progress_percentage: overallProgress,
          })
          .eq("user_id", user.id)
          .eq("course_id", courseId);
          
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment-status", courseId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["course-progress", courseId, user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    markContentAsCompleted: (contentId: string) => markContentAsCompleted.mutateAsync(contentId),
    isUpdating: markContentAsCompleted.isPending,
  };
}
