
import { useMemo } from 'react';
import { useGreenSkills, GreenSkill } from '@/hooks/useGreenSkills';

export interface SkillCategory {
  subject: string;
  userLevel: number;
  marketDemand: number;
}

export function useSkillGapData() {
  const { data: greenSkills = [] } = useGreenSkills();

  const skillGapData = useMemo(() => {
    // Get unique categories from green skills
    const uniqueCategories = Array.from(new Set(greenSkills.map(skill => skill.category)));
    
    // Calculate user skills and market demand by category
    const result = uniqueCategories.map(category => {
      const categorySkills = greenSkills.filter(skill => skill.category === category);
      
      // Calculate average CO2 reduction potential as proxy for user skill level
      const totalUserLevel = categorySkills.reduce((sum, skill) => {
        return sum + (skill.co2_reduction_potential || 0);
      }, 0);
      
      // Calculate average market growth rate for category
      const totalMarketDemand = categorySkills.reduce((sum, skill) => {
        return sum + (skill.market_growth_rate || 0);
      }, 0);
      
      const userLevel = categorySkills.length > 0 
        ? Math.min(Math.round(totalUserLevel / categorySkills.length), 10) : 0;
        
      const marketDemand = categorySkills.length > 0 
        ? Math.min(Math.round(totalMarketDemand / categorySkills.length / 5), 10) : 0;
      
      return {
        subject: category,
        userLevel,
        marketDemand
      };
    });
    
    return result;
  }, [greenSkills]);
  
  return skillGapData;
}
