
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useMentorshipRelationship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    getMentorshipRelationships,
  };
}
