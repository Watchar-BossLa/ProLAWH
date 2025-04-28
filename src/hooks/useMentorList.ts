
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function useMentorList() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  return {
    loading,
    error,
    getMentors,
  };
}
