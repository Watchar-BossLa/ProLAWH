
import { useMemo } from "react";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import type { ProgressData, OverviewDataPoint, SkillDataPoint } from "../types/skillProgressionTypes";

const PRESET_SKILLS = ["React", "TypeScript", "Machine Learning", "Cloud Architecture", "UX Design"];
const FUTURE_MONTHS = 6;

export function useSkillProgressionData(): ProgressData {
  const skillGapData = useSkillGapData();
  
  return useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const startMonth = currentMonth - 3 < 0 ? currentMonth + 9 : currentMonth - 3;
    
    const pastMonths = months.slice(startMonth, startMonth + 3);
    const futureMonths = [];
    for (let i = 0; i < FUTURE_MONTHS; i++) {
      const monthIndex = (startMonth + 3 + i) % 12;
      futureMonths.push(months[monthIndex]);
    }
    
    const allMonths = [...pastMonths, ...futureMonths];
    
    // Get average user level from skill gap data for starting point
    const avgUserLevel = skillGapData.length 
      ? skillGapData.reduce((sum, skill) => sum + skill.userLevel, 0) / skillGapData.length 
      : 5;
    
    const avgMarketDemand = skillGapData.length 
      ? skillGapData.reduce((sum, skill) => sum + skill.marketDemand, 0) / skillGapData.length 
      : 7;
    
    // Generate overview data
    const overviewData: OverviewDataPoint[] = allMonths.map((month, index) => {
      const isPast = index < 3;
      const growthRate = 0.8;
      
      const pastProgress = avgUserLevel - (3 - index) * (growthRate * 0.7);
      const futureProgress = avgUserLevel + (index - 2) * growthRate;
      
      return {
        month,
        current: isPast ? Math.max(0, Math.min(10, pastProgress)) : null,
        projected: Math.max(0, Math.min(10, isPast ? pastProgress : futureProgress)),
        marketAverage: Math.min(10, avgMarketDemand + (index - 2) * 0.1),
      };
    });
    
    // Generate individual skill data
    const skillsData: Record<string, SkillDataPoint[]> = {};
    
    PRESET_SKILLS.forEach(skill => {
      const skillInfo = skillGapData.find(s => s.subject === skill);
      const initialLevel = skillInfo ? skillInfo.userLevel : Math.floor(Math.random() * 5) + 2;
      const marketLevel = skillInfo ? skillInfo.marketDemand : Math.floor(Math.random() * 3) + 7;
      
      const gap = marketLevel - initialLevel;
      const growthRate = gap > 3 ? 0.9 : gap > 1 ? 0.7 : 0.5;
      
      skillsData[skill] = allMonths.map((month, index) => {
        const isPast = index < 3;
        const pastProgress = initialLevel - (3 - index) * (growthRate * 0.6);
        const futureProgress = initialLevel + (index - 2) * growthRate;
        
        return {
          month,
          skill,
          current: isPast ? Math.max(0, Math.min(10, pastProgress)) : null,
          projected: Math.max(0, Math.min(10, isPast ? pastProgress : futureProgress)),
          marketLevel: Math.min(10, marketLevel),
        };
      });
    });
    
    return {
      overview: overviewData,
      skills: skillsData
    };
  }, [skillGapData]);
}
