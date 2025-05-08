
import { useQuery } from "@tanstack/react-query";
import { CourseReview } from "@/types/learning";

export function useCourseReviewsList(courseId: string) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      // Return mock data
      return [
        {
          id: "1",
          user_id: "user1",
          username: "John Doe",
          avatar_url: "/placeholder.svg",
          rating: 5,
          comment: "Great course! Very informative.",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          user_id: "user2",
          username: "Jane Smith",
          avatar_url: "/placeholder.svg",
          rating: 4,
          comment: "I learned a lot from this course.",
          created_at: new Date().toISOString()
        }
      ] as CourseReview[];
    },
    enabled: !!courseId,
  });

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum: number, review: CourseReview) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    averageRating,
    isLoading
  };
}
