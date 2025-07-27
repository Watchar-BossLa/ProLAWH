
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MarketIntelligence } from '@/types/ai-matching';

export function useMarketIntelligence() {
  const { data: marketData = [], isLoading } = useQuery({
    queryKey: ['market-intelligence'],
    queryFn: async (): Promise<MarketIntelligence[]> => {
      try {
        // Since market_intelligence table doesn't exist, return mock data for now
        // In production, this would query the actual market intelligence table
        const mockData: MarketIntelligence[] = [
          {
            id: '1',
            skill_id: '1',
            region: 'North America',
            demand_score: 0.85,
            supply_score: 0.65,
            avg_rate_usd: 95,
            trend_direction: 'rising',
            forecast_data: { next_6_months: 'increasing', confidence: 0.8 },
            data_source: 'internal_analysis',
            collected_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            skill: {
              id: '1',
              name: 'React Development',
              category: 'Frontend'
            }
          },
          {
            id: '2',
            skill_id: '2',
            region: 'Europe',
            demand_score: 0.78,
            supply_score: 0.70,
            avg_rate_usd: 88,
            trend_direction: 'stable',
            forecast_data: { next_6_months: 'stable', confidence: 0.9 },
            data_source: 'market_research',
            collected_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            skill: {
              id: '2',
              name: 'TypeScript',
              category: 'Programming'
            }
          }
        ];
        
        return mockData;
      } catch (error) {
        console.error('Error fetching market intelligence:', error);
        return [];
      }
    },
  });

  return {
    marketData,
    isLoading,
  };
}
