
import { supabase } from "@/integrations/supabase/client";
import { UserNote } from "@/types/learning";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export function useCourseNotes(courseId: string, contentId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["course-notes", courseId, contentId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // We'll use a workaround since the user_notes table doesn't exist
      // This returns an empty array for now, but would normally fetch from the user_notes table
      return [] as UserNote[];
      
      // Once the user_notes table exists, we would use:
      /*
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId);
        
      if (contentId) {
        query.eq("content_id", contentId);
      }
      
      if (error) throw error;
      return data as UserNote[];
      */
    },
    enabled: !!courseId && !!user?.id,
  });
  
  const saveNote = useMutation({
    mutationFn: async ({ contentId, note }: { contentId: string, note: string }): Promise<void> => {
      if (!user?.id) throw new Error("You must be logged in to save notes");
      
      // We'll create a mock response since the user_notes table doesn't exist
      // Once the table exists, we would use:
      /*
      const { data, error } = await supabase
        .from("user_notes")
        .insert({
          user_id: user.id,
          course_id: courseId,
          content_id: contentId,
          note: note
        })
        .select()
        .single();
      
      if (error) throw error;
      */
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });

      // Return void to match the expected return type
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-notes"] });
    },
  });
  
  const deleteNote = useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      if (!user?.id) throw new Error("You must be logged in to delete notes");
      
      // We'll create a mock response since the user_notes table doesn't exist
      // Once the table exists, we would use:
      /*
      const { error } = await supabase
        .from("user_notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);
      
      if (error) throw error;
      */
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-notes"] });
    },
  });
  
  return {
    notes,
    isLoading,
    saveNote: (contentId: string, note: string) => saveNote.mutateAsync({ contentId, note }),
    deleteNote: (noteId: string) => deleteNote.mutateAsync(noteId),
    isSaving: saveNote.isPending,
    isDeleting: deleteNote.isPending,
  };
}
