
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useMentorshipResources() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addMentorshipResource = async (
    mentorshipId: string,
    title: string,
    type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'other',
    url?: string,
    description?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to add resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const resource = {
        mentorship_id: mentorshipId,
        title,
        type,
        url,
        description,
        added_by: user.id,
      };

      const { data, error } = await supabase
        .from('mentorship_resources')
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Resource Added',
        description: 'Your resource has been added successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding resource'));
      console.error('Error adding mentorship resource:', err);
      
      toast({
        title: 'Failed to Add Resource',
        description: 'Could not add the resource. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateResourceStatus = async (resourceId: string, completed: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to update resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_resources')
        .update({ completed })
        .eq('id', resourceId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Resource Updated',
        description: `Resource marked as ${completed ? 'completed' : 'incomplete'}.`,
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating resource'));
      console.error('Error updating mentorship resource:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update resource status. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMentorshipResources = async (mentorshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_resources')
        .select(`
          *,
          added_by_profile:added_by(profiles:id(full_name))
        `)
        .eq('mentorship_id', mentorshipId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching resources'));
      console.error('Error fetching mentorship resources:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addMentorshipResource,
    updateResourceStatus,
    getMentorshipResources,
  };
}
