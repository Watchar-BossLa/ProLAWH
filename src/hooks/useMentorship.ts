import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useMentorshipSessions } from './useMentorshipSessions';
import { useMentorshipProgress } from './useMentorshipProgress';
import { useMentorshipResources } from './useMentorshipResources';

export type { 
  MentorProfile,
  MentorshipRelationship,
  MentorshipSession,
  MentorshipProgress,
  MentorshipResource,
  MentorshipRequest
} from './types/mentorship';

export function useMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessions = useMentorshipSessions();
  const progress = useMentorshipProgress();
  const resources = useMentorshipResources();

  // Get all mentors
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

  // Send mentorship request
  const sendMentorshipRequest = async (request: Omit<MentorshipRequest, 'id' | 'requester_id' | 'status' | 'created_at'>) => {
    if (!user) {
      setError(new Error('You must be logged in to send a mentorship request'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const newRequest = {
        requester_id: user.id,
        status: 'pending',
        ...request
      };

      const { data, error } = await supabase
        .from('mentorship_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Mentorship Request Sent',
        description: 'Your mentorship request has been sent successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error sending mentorship request'));
      console.error('Error sending mentorship request:', err);
      
      toast({
        title: 'Request Failed',
        description: 'Failed to send mentorship request. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle mentorship request response (accept/decline)
  const respondToMentorshipRequest = async (requestId: string, accept: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to respond to requests'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      // First, update the request status
      const { data: updatedRequest, error: updateError } = await supabase
        .from('mentorship_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)
        .eq('mentor_id', user.id) // Only the mentor can respond
        .select()
        .single();

      if (updateError) throw updateError;

      if (accept) {
        // Create a new mentorship relationship
        const { data: request } = await supabase
          .from('mentorship_requests')
          .select()
          .eq('id', requestId)
          .single();

        if (!request) throw new Error('Request not found');

        const relationship = {
          mentor_id: request.mentor_id,
          mentee_id: request.requester_id,
          status: 'active',
          focus_areas: request.focus_areas,
          goals: request.goals ? request.goals.join('\n') : null,
        };

        const { data: mentorship, error: createError } = await supabase
          .from('mentorship_relationships')
          .insert(relationship)
          .select()
          .single();

        if (createError) throw createError;

        toast({
          title: 'Mentorship Accepted',
          description: 'You have successfully accepted the mentorship request.',
        });

        return mentorship;
      }

      toast({
        title: 'Request Declined',
        description: 'You have declined the mentorship request.',
      });

      return updatedRequest;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error responding to request'));
      console.error('Error responding to mentorship request:', err);
      
      toast({
        title: 'Action Failed',
        description: 'Failed to process your response. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship relationships for current user
  const getMentorshipRelationships = async (status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentorships'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('mentorship_relationships')
        .select(`
          *,
          mentor:mentor_id(id, profiles:id(full_name, avatar_url)),
          mentee:mentee_id(id, profiles:id(full_name, avatar_url))
        `)
        .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentorships'));
      console.error('Error fetching mentorship relationships:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    ...sessions,
    ...progress,
    ...resources,
    getMentors,
    sendMentorshipRequest,
    respondToMentorshipRequest,
    getMentorshipRelationships,
  };
}
