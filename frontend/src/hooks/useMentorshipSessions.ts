
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useMentorshipSessions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scheduleMentorshipSession = async (
    relationshipId: string, 
    scheduledFor: Date, 
    durationMinutes: number, 
    notes?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to schedule sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const session = {
        relationship_id: relationshipId,
        scheduled_for: scheduledFor.toISOString(),
        duration_minutes: durationMinutes,
        notes,
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Session Scheduled',
        description: 'Your mentorship session has been scheduled successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error scheduling session'));
      console.error('Error scheduling mentorship session:', err);
      
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule the session. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSessionFeedback = async (
    sessionId: string,
    status: 'completed' | 'cancelled' | 'rescheduled',
    isMentor: boolean,
    feedback?: string,
    rating?: number
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to update sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const updates = {
        status,
        ...(isMentor
          ? { mentor_feedback: feedback, mentor_rating: rating }
          : { mentee_feedback: feedback, mentee_rating: rating }),
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Feedback Saved',
        description: 'Your feedback has been saved successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating session'));
      console.error('Error updating mentorship session:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to save your feedback. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMentorshipSessions = async (relationshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('relationship_id', relationshipId)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching sessions'));
      console.error('Error fetching mentorship sessions:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scheduleMentorshipSession,
    updateSessionFeedback,
    getMentorshipSessions,
  };
}
