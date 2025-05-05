
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { MockData } from '@/types/mocks';

interface MentorshipRequest {
  mentor_id: string;
  message: string;
  focus_areas: string[];
  industry: string;
  expected_duration?: string;
  goals?: string[];
}

export function useMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMentorshipRequest = async (request: MentorshipRequest) => {
    if (!user) {
      setError(new Error('You must be logged in to send a mentorship request'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          ...request,
          requester_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: 'Request Sent',
        description: 'Your mentorship request has been sent successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error sending mentorship request'));
      console.error('Error sending mentorship request:', err);
      
      toast({
        title: 'Request Failed',
        description: 'Failed to send mentorship request. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Add required methods that are being used in components
  const getMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:id(full_name, avatar_url)
        `);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentors'));
      console.error('Error fetching mentors:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const getMentorshipRelationships = async (status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentorships'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      // Query where user is either mentor or mentee
      const { data, error } = await supabase
        .from('mentorship_relationships')
        .select('*');

      if (error) throw error;
      
      // Filter by status if provided
      let result = Array.isArray(data) ? data : [];
      if (status) {
        result = result.filter(item => item.status === status);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentorship relationships'));
      console.error('Error fetching mentorship relationships:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const addMentorshipResource = async (resource: any) => {
    if (!user) {
      setError(new Error('You must be logged in to add resources'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('mentorship_resources')
        .insert({
          ...resource,
          added_by: user.id
        });

      if (error) throw error;
      
      toast({
        title: 'Resource Added',
        description: 'The resource has been added successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding resource'));
      console.error('Error adding mentorship resource:', err);
      
      toast({
        title: 'Failed',
        description: 'Failed to add the resource. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateSessionFeedback = async (sessionId: string, feedback: any) => {
    if (!user) {
      setError(new Error('You must be logged in to update session feedback'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('mentorship_sessions')
        .update(feedback)
        .eq('id', sessionId);

      if (error) throw error;
      
      toast({
        title: 'Feedback Updated',
        description: 'Your feedback has been saved successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating session feedback'));
      console.error('Error updating session feedback:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to save your feedback. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const scheduleMentorshipSession = async (session: any) => {
    if (!user) {
      setError(new Error('You must be logged in to schedule a session'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('mentorship_sessions')
        .insert(session);

      if (error) throw error;
      
      toast({
        title: 'Session Scheduled',
        description: 'The mentorship session has been scheduled successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error scheduling session'));
      console.error('Error scheduling mentorship session:', err);
      
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule the session. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMentorshipRequest,
    getMentors,
    getMentorshipRelationships,
    addMentorshipResource,
    updateSessionFeedback,
    scheduleMentorshipSession
  };
}
