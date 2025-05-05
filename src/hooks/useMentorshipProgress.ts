
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useMentorshipProgress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addProgressMilestone = async (
    mentorshipId: string,
    milestone: string,
    completed: boolean = false,
    notes?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to add progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const progressItem = {
        mentorship_id: mentorshipId,
        milestone,
        completed,
        notes,
      };

      const response = await supabase
        .from('mentorship_progress')
        .insert(progressItem)
        .select();
        
      // Check if response has data and single method
      const data = response.data?.[0] || null;
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Progress Updated',
        description: 'Mentorship progress has been updated successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding progress'));
      console.error('Error adding mentorship progress:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProgressStatus = async (progressId: string, completed: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to update progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await supabase
        .from('mentorship_progress')
        .update({ completed })
        .eq('id', progressId)
        .select();
        
      // Check if response has data and single method
      const data = response.data?.[0] || null;
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Progress Updated',
        description: `Milestone marked as ${completed ? 'completed' : 'incomplete'}.`,
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating progress'));
      console.error('Error updating mentorship progress:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update milestone status. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMentorshipProgress = async (mentorshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_progress')
        .select('*')
        .eq('mentorship_id', mentorshipId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching progress'));
      console.error('Error fetching mentorship progress:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addProgressMilestone,
    updateProgressStatus,
    getMentorshipProgress,
  };
}
