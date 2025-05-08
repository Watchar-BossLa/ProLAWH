
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { MarkContentCompletedOptions } from "@/types/courseProgress";
import {
  getExistingProgress,
  updateCourseProgress,
  createCourseProgress,
  getTotalContentCount
} from "@/services/courseProgressService";

export function useCourseProgress(courseId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const markContentAsCompleted = useMutation({
    mutationFn: async ({ contentId }: MarkContentCompletedOptions) => {
      if (!user?.id) {
        throw new Error("You must be logged in to track progress");
      }

      // Get existing progress
      const existingProgress = await getExistingProgress(user.id, courseId);
      
      // Get total content count for percentage calculation
      const totalContentCount = await getTotalContentCount(courseId);
      
      if (existingProgress) {
        // Safely access completed_content_ids with proper type checking
        const completedContentIdsRaw = existingProgress.completed_content_ids || [];
        // Ensure it's an array
        const completedIds = Array.isArray(completedContentIdsRaw) ? completedContentIdsRaw : [];
        
        // Don't add if already completed
        if (completedIds.includes(contentId)) {
          return existingProgress;
        }
        
        const updatedContentIds = [...completedIds, contentId];
        const overallProgress = Math.round((updatedContentIds.length / totalContentCount) * 100);
        
        // Determine if course is now complete
        const completedAt = overallProgress === 100 ? new Date().toISOString() : existingProgress.completed_at;
        
        // Update existing progress
        return await updateCourseProgress(existingProgress.id, {
          completed_content_ids: updatedContentIds,
          overall_progress: overallProgress,
          last_accessed_at: new Date().toISOString(),
          completed_at: completedAt,
        });
      } else {
        // Create new progress entry
        const overallProgress = Math.round((1 / totalContentCount) * 100);
        
        return await createCourseProgress(user.id, courseId, contentId, overallProgress);
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
    markContentAsCompleted: (contentId: string) => 
      markContentAsCompleted.mutateAsync({ contentId }),
    isUpdating: markContentAsCompleted.isPending,
  };
}
