
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCoursesWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["courses-wishlist", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_wishlist")
        .select(`
          id,
          created_at,
          courses:course_id (
            id,
            title,
            description,
            cover_image,
            estimated_duration,
            difficulty_level
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        createdAt: item.created_at,
        course: item.courses
      }));
    },
    enabled: !!user?.id,
  });

  const addToWishlist = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) throw new Error("You must be logged in to save courses");
      
      const { data, error } = await supabase
        .from("user_wishlist")
        .insert({
          user_id: user.id,
          course_id: courseId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-wishlist"] });
      toast({
        title: "Course saved",
        description: "The course has been added to your wishlist",
      });
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
      
      const { error } = await supabase
        .from("user_wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses-wishlist"] });
      toast({
        title: "Course removed",
        description: "The course has been removed from your wishlist",
      });
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
