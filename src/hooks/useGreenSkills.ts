
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GreenSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  co2_reduction_potential: number;
  market_growth_rate: number;
  created_at: string;
  updated_at: string;
}

export function useGreenSkills() {
  return useQuery({
    queryKey: ['green-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('green_skills')
        .select('*');

      if (error) throw error;
      return data as GreenSkill[];
    }
  });
}
