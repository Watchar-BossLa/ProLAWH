
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface WishlistItem {
  id: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    cover_image: string | null;
    estimated_duration: string | null;
    difficulty_level: string;
  };
}

export function useCoursesWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["courses-wishlist", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Mock implementation since user_wishlist table doesn't exist
      // In a real implementation, this would query the database
      return [] as WishlistItem[];
    },
    enabled: !!user?.id,
  });

  const addToWishlist = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) throw new Error("You must be logged in to save courses");
      
      // Mock implementation - would insert to database in real implementation
      toast({
        title: "Course saved",
        description: "The course has been added to your wishlist",
      });
      
      // Return a mock entry
      return {
        id: `wish-${Date.now()}`,
        user_id: user.id,
        course_id: courseId,
        created_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-wishlist"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) throw new Error("You must be logged in to update your wishlist");
      
      // Mock implementation - would delete from database in real implementation
      toast({
        title: "Course removed",
        description: "The course has been removed from your wishlist",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-wishlist"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isInWishlist = (courseId: string) => {
    return wishlist.some(item => item.course.id === courseId);
  };

  const toggleWishlist = (courseId: string) => {
    if (isInWishlist(courseId)) {
      removeFromWishlist.mutate(courseId);
    } else {
      addToWishlist.mutate(courseId);
    }
  };

  return {
    wishlist,
    isLoading,
    isInWishlist,
    toggleWishlist,
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
