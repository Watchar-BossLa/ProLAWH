
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useCourseReviews(courseId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const submitReview = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      if (!user?.id) {
        throw new Error("You must be logged in to submit a review");
      }

      // Check if user has already reviewed this course
      const { data: existingReview, error: checkError } = await supabase
        .from("course_reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("course_reviews")
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingReview.id);

        if (error) throw error;
        return { updated: true };
      } else {
        // Create new review
        const { error } = await supabase.from("course_reviews").insert({
          user_id: user.id,
          course_id: courseId,
          rating,
          comment,
        });

        if (error) throw error;
        return { updated: false };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      toast({
        title: data.updated ? "Review updated" : "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    submitReview: (rating: number, comment: string) =>
      submitReview.mutate({ rating, comment }),
    isSubmitting: submitReview.isPending,
  };
}
