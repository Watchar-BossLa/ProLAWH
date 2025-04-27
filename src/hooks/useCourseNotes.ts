
import { supabase } from "@/integrations/supabase/client";
import { UserNote } from "@/types/learning";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useCourseNotes(courseId: string, contentId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["course-notes", courseId, contentId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const query = supabase
        .from("user_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId);
        
      if (contentId) {
        query.eq("content_id", contentId);
      }
      
      const { data, error } = await query
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as UserNote[];
    },
    enabled: !!courseId && !!user?.id,
  });
  
  const saveNote = useMutation({
    mutationFn: async ({ contentId, note }: { contentId: string, note: string }) => {
      if (!user?.id) throw new Error("You must be logged in to save notes");
      
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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-notes"] });
    },
  });
  
  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      if (!user?.id) throw new Error("You must be logged in to delete notes");
      
      const { error } = await supabase
        .from("user_notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);
      
      if (error) throw error;
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
