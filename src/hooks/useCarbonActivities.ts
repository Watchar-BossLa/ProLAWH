
import { useState } from 'react';
import { CarbonActivity } from '@/types/carbon';
import { defaultCarbonActivities } from '@/data/defaultCarbonActivities';

export function useCarbonActivities(initialActivities?: CarbonActivity[]) {
  const [activities, setActivities] = useState<CarbonActivity[]>(
    initialActivities || defaultCarbonActivities
  );
  
  const handleValueChange = (index: number, newValue: number) => {
    const newActivities = [...activities];
    newActivities[index].value = newValue;
    setActivities(newActivities);
  };
  
  return {
    activities,
    setActivities,
    handleValueChange
  };
}
