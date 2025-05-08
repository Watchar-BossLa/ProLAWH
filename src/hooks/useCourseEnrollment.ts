
import { useQuery } from "@tanstack/react-query";
import { EnrollmentStatus } from "@/types/learning";
import { useAuth } from "@/hooks/useAuth";

export function useCourseEnrollment(courseId: string) {
  const { user } = useAuth();
  
  const { data: enrollmentStatus, isLoading } = useQuery({
    queryKey: ["enrollment-status", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id) return { is_enrolled: false, progress_percentage: 0, completed_content_ids: [] };

      // Mock enrollment data
      const mockEnrollmentStatus = {
        is_enrolled: true,
        progress_percentage: 35,
        last_content_id: "content-1",
        completed_content_ids: ["content-1"]
      };

      // Mock progress data
      const mockProgressData = {
        overall_progress: 35,
        completed_content_ids: ["content-1"],
      };

      return {
        is_enrolled: true,
        progress_percentage: mockProgressData.overall_progress,
        last_content_id: mockProgressData.completed_content_ids[mockProgressData.completed_content_ids.length - 1],
        completed_content_ids: mockProgressData.completed_content_ids
      } as EnrollmentStatus;
    },
    enabled: !!courseId && !!user?.id,
  });

  return { enrollmentStatus, isLoading };
}
