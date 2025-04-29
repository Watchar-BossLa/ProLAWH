
import { CarbonActivity, CategoryBreakdown } from '@/types/carbon';

export const calculateTotalImpact = (activities: CarbonActivity[]): number => {
  return activities.reduce((total, activity) => {
    // Convert to monthly impact
    const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
    return total + (activity.impactPerUnit * activity.value * monthlyMultiplier);
  }, 0);
};

export const calculateCategoryBreakdown = (activities: CarbonActivity[]): CategoryBreakdown => {
  const breakdown: CategoryBreakdown = {};
  
  activities.forEach(activity => {
    const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
    const impact = activity.impactPerUnit * activity.value * monthlyMultiplier;
    
    if (breakdown[activity.category]) {
      breakdown[activity.category] += impact;
    } else {
      breakdown[activity.category] = impact;
    }
  });
  
  return breakdown;
};
