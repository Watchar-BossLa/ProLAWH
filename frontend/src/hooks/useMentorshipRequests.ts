
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { MentorshipRequest } from './types/mentorship';

export function useMentorshipRequests() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
      } as MentorshipRequest;

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

  const respondToMentorshipRequest = async (requestId: string, accept: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to respond to requests'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: updatedRequest, error: updateError } = await supabase
        .from('mentorship_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)
        .eq('mentor_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (accept) {
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

  return {
    loading,
    error,
    sendMentorshipRequest,
    respondToMentorshipRequest,
  };
}
