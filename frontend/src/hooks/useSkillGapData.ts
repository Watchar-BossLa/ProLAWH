
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface SkillGapItem {
  subject: string;
  userLevel: number;
  marketDemand: number;
  isGreenSkill?: boolean;
  growthRate?: number;
}

export function useSkillGapData() {
  const { user } = useAuth();

  // In a real app, this would query the database
  const { data } = useQuery({
    queryKey: ['skill-gap-data', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Simulated data - in a real app, this would be a database call
      // Example: const { data, error } = await supabase.from('user_skills').select('*').eq('user_id', user.id);
      
      return [
        { subject: "React", userLevel: 7, marketDemand: 9, isGreenSkill: false, growthRate: 5 },
        { subject: "TypeScript", userLevel: 6, marketDemand: 8, isGreenSkill: false, growthRate: 8 },
        { subject: "Node.js", userLevel: 5, marketDemand: 7, isGreenSkill: false, growthRate: 6 },
        { subject: "Cloud Architecture", userLevel: 4, marketDemand: 9, isGreenSkill: true, growthRate: 12 },
        { subject: "Machine Learning", userLevel: 3, marketDemand: 8, isGreenSkill: false, growthRate: 15 },
        { subject: "Data Analysis", userLevel: 6, marketDemand: 8, isGreenSkill: false, growthRate: 9 },
        { subject: "Sustainable Development", userLevel: 5, marketDemand: 8, isGreenSkill: true, growthRate: 14 },
        { subject: "UI Design", userLevel: 7, marketDemand: 7, isGreenSkill: false, growthRate: 4 },
        { subject: "API Design", userLevel: 8, marketDemand: 7, isGreenSkill: false, growthRate: 3 },
        { subject: "DevOps", userLevel: 4, marketDemand: 9, isGreenSkill: false, growthRate: 10 },
        { subject: "Renewable Energy Tech", userLevel: 2, marketDemand: 7, isGreenSkill: true, growthRate: 18 }
      ] as SkillGapItem[];
    },
    enabled: !!user,
    // Non-production app can use longer staleTime
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return data || [];
}
