
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

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

  return {
    loading,
    error,
    sendMentorshipRequest,
  };
}
