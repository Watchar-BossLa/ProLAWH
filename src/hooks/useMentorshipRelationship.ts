
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
      // Use SELECT to build the query instead of OR
      let query = supabase
        .from('mentorship_relationships')
        .select(`
          *,
          mentor:mentor_id(id, profiles:id(full_name, avatar_url)),
          mentee:mentee_id(id, profiles:id(full_name, avatar_url))
        `);

      // Apply filters if status is provided
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter results in memory to simulate the behavior of OR
      const filteredData = data ? data.filter(rel => 
        rel.mentor_id === user.id || rel.mentee_id === user.id
      ) : [];
      
      return filteredData;
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
