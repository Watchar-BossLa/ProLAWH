
import { useMemo } from "react";
import type { ViewType, SkillDataPoint } from "../types/skillProgressionTypes";
import { FUTURE_MONTHS } from "../utils/chartConfig";

interface MarketCrossoverPoint {
  months: number;
  achieved: boolean;
}

export function useMarketCrossover(
  viewType: ViewType,
  currentData: any
): MarketCrossoverPoint | null {
  return useMemo(() => {
    if (viewType === 'specific' && currentData) {
      const skillData = currentData as SkillDataPoint[];
      const marketLevel = skillData[0]?.marketLevel || 0;
      let monthsToMarket = FUTURE_MONTHS;
      
      for (let i = 0; i < skillData.length; i++) {
        if (skillData[i].projected >= marketLevel) {
          monthsToMarket = i;
          break;
        }
      }
      
      return {
        months: monthsToMarket,
        achieved: monthsToMarket < FUTURE_MONTHS
      };
    }
    return null;
  }, [currentData, viewType]);
}
