
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Leaf } from 'lucide-react';
import { GreenSkillsList } from '@/components/skills/GreenSkillsList';
import { GreenSkillStats } from '@/components/skills/GreenSkillStats';
import { GreenSkillsOverview } from '@/components/skills/GreenSkillsOverview';
import { GreenSkillCategories } from '@/components/skills/GreenSkillCategories';
import { TopGreenSkills } from '@/components/skills/TopGreenSkills';
import { Separator } from "@/components/ui/separator";

interface GreenSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  co2_reduction_potential: number;
  market_growth_rate: number;
  created_at: string;
  updated_at: string;
}

const fetchGreenSkills = async () => {
  const { data, error } = await supabase
    .from('green_skills')
    .select('*');

  if (error) throw error;
  return data as GreenSkill[];
};

export default function GreenSkillsPage() {
  const { 
    data: greenSkills = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['green-skills'],
    queryFn: fetchGreenSkills
  });

  if (error) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <p className="text-destructive">Error fetching green skills: {(error as Error).message}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold">Green Skills</h1>
      </div>
      
      <p className="text-muted-foreground max-w-2xl">
        Explore sustainable skills that contribute to environmental conservation and eco-friendly practices.
        Track their CO2 reduction potential and market growth rates to stay ahead in the green economy.
      </p>

      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <GreenSkillsOverview />
          <Separator className="my-8" />
          <TopGreenSkills skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillStats skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillCategories skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillsList skills={greenSkills} />
        </>
      )}
    </div>
  );
}
