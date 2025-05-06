
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface MentorshipRequest {
  mentor_id: string;
  message: string;
  focus_areas?: string[];
  industry?: string;
  expected_duration?: string;
  goals?: string[];
}

export function useMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Send a mentorship request
  const sendMentorshipRequest = async (request: MentorshipRequest): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to send mentorship requests'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('mentorship_requests').insert({
        requester_id: user.id,
        mentor_id: request.mentor_id,
        message: request.message,
        focus_areas: request.focus_areas || [],
        industry: request.industry || "",
        expected_duration: request.expected_duration,
        status: 'pending',
        goals: request.goals || []
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
        description: 'There was an error sending your mentorship request. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add mentorship resource
  const addMentorshipResource = async (
    mentorshipId: string,
    title: string,
    type: string,
    url?: string,
    description?: string
  ): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to add resources'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('mentorship_resources').insert({
        mentorship_id: mentorshipId,
        added_by: user.id,
        title,
        type,
        url: url || null,
        description: description || null
      });

      if (error) throw error;
      
      toast({
        title: 'Resource Added',
        description: 'The mentorship resource has been added successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding mentorship resource'));
      console.error('Error adding mentorship resource:', err);
      
      toast({
        title: 'Failed to Add Resource',
        description: 'There was an error adding the resource. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update session feedback
  const updateSessionFeedback = async (
    sessionId: string,
    status: string,
    isMentor: boolean = false,
    feedback?: string,
    rating?: number
  ): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to provide feedback'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const updateData: Record<string, any> = { status };
      
      if (feedback) {
        updateData[isMentor ? 'mentor_feedback' : 'mentee_feedback'] = feedback;
      }
      
      if (rating) {
        updateData[isMentor ? 'mentor_rating' : 'mentee_rating'] = rating;
      }
      
      const { error } = await supabase
        .from('mentorship_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;
      
      toast({
        title: status === 'completed' ? 'Session Completed' : 'Status Updated',
        description: status === 'completed' ? 'Session marked as completed with your feedback.' : `Session status updated to ${status}.`,
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating session'));
      console.error('Error updating session:', err);
      
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the session. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Schedule mentorship session
  const scheduleMentorshipSession = async (
    relationshipId: string,
    scheduledFor: Date,
    durationMinutes: number,
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      setError(new Error('You must be logged in to schedule sessions'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('mentorship_sessions').insert({
        relationship_id: relationshipId,
        scheduled_for: scheduledFor.toISOString(),
        duration_minutes: durationMinutes,
        status: 'scheduled',
        notes: notes || null
      });

      if (error) throw error;
      
      toast({
        title: 'Session Scheduled',
        description: 'Mentorship session has been scheduled successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error scheduling session'));
      console.error('Error scheduling session:', err);
      
      toast({
        title: 'Scheduling Failed',
        description: 'There was an error scheduling the session. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get mentors (mock)
  const getMentors = async () => {
    return [];
  };

  // Get mentorship relationships (mock)
  const getMentorshipRelationships = async () => {
    return [];
  };

  return {
    loading,
    error,
    sendMentorshipRequest,
    addMentorshipResource,
    updateSessionFeedback,
    scheduleMentorshipSession,
    getMentors,
    getMentorshipRelationships
  };
}
