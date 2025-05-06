
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
        .select("*");

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      
      // Use mock data for our response since real API would return data
      const mockExistingProgress = existingProgress && existingProgress.length > 0 
        ? existingProgress[0] 
        : null;

      // Get total content count for percentage calculation
      const totalContentCount = 10; // Mock value for total contents
      
      if (mockExistingProgress) {
        // Safely access completed_content_ids with type checking
        const mockCompletedIds = mockExistingProgress.completed_content_ids || [];
        
        // Don't add if already completed
        if (Array.isArray(mockCompletedIds) && mockCompletedIds.includes(contentId)) {
          return mockExistingProgress;
        }
        
        const updatedContentIds = Array.isArray(mockCompletedIds) ? [...mockCompletedIds, contentId] : [contentId];
        const overallProgress = Math.round((updatedContentIds.length / totalContentCount) * 100);
        
        // Update existing progress
        const { data, error } = await supabase
          .from("course_progress")
          .update({
            completed_content_ids: updatedContentIds,
            overall_progress: overallProgress,
            last_accessed_at: new Date().toISOString(),
            completed_at: overallProgress === 100 ? new Date().toISOString() : mockExistingProgress.completed_at,
          });

        if (error) throw error;
        
        // Return mock response
        return {
          id: 'mock-id',
          completed_content_ids: updatedContentIds,
          overall_progress: overallProgress,
          completed_at: overallProgress === 100 ? new Date().toISOString() : null
        };
      } else {
        // Create new progress entry with mock data
        const overallProgress = Math.round((1 / totalContentCount) * 100);
        
        const { data, error } = await supabase
          .from("course_progress")
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed_content_ids: [contentId],
            overall_progress: overallProgress,
          });

        if (error) throw error;
        
        // Return mock response
        return {
          id: 'mock-id',
          completed_content_ids: [contentId],
          overall_progress: overallProgress
        };
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
