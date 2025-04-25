
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '@/types/arcade';

export function useChallenge(challengeId: string | undefined) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;
      
      const { data, error } = await supabase
        .from('arcade_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!error && data) {
        setChallenge(data as Challenge);
      }
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user.id || null);
    };

    fetchChallenge();
    checkAuth();
  }, [challengeId]);

  return { challenge, userId };
}
