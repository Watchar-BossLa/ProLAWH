
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlockchainCredential } from '@/types/blockchain';
import { MockData } from '@/types/mocks';

export function useBlockchainCredentials(userId?: string) {
  const [credentials, setCredentials] = useState<BlockchainCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchCredentials = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blockchain_credentials')
          .select('*, skills:skill_id(name)')
          .eq('user_id', userId);

        if (error) throw error;

        // Ensure we transform the mock data to match our expected types
        if (data && Array.isArray(data)) {
          const typedCredentials: BlockchainCredential[] = data.map((item: MockData) => {
            // Handle typescript type safety by checking for properties
            return {
              id: item.id || '',
              user_id: item.user_id || userId,
              skill_id: item.skill_id || '',
              issued_at: item.issued_at || new Date().toISOString(),
              expires_at: item.expires_at,
              metadata: item.metadata || {},
              is_verified: item.is_verified || false,
              credential_type: item.credential_type || 'standard',
              credential_hash: item.credential_hash || '',
              transaction_id: item.transaction_id || '',
              skills: item.skills || { name: 'Unknown Skill' }
            };
          });
          setCredentials(typedCredentials);
        } else {
          setCredentials([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching blockchain credentials'));
        console.error('Error fetching blockchain credentials:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [userId]);

  return { credentials, isLoading, error };
}
