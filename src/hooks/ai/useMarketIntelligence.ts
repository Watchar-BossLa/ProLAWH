
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketIntelligence } from '@/types/ai-matching';

export function useMarketIntelligence() {
  const { data: marketData = [], isLoading } = useQuery({
    queryKey: ['market-intelligence'],
    queryFn: async (): Promise<MarketIntelligence[]> => {
      try {
        const { data, error } = await supabase
          .from('market_intelligence' as any)
          .select(`
            *,
            skill:skills_taxonomy(*)
          `)
          .limit(10);
        
        if (error) {
          console.error('Error fetching market intelligence:', error);
          return [];
        }
        
        return (data || []) as MarketIntelligence[];
      } catch (error) {
        console.error('Unexpected error:', error);
        return [];
      }
    },
  });

  return {
    marketData,
    isLoading,
  };
}
