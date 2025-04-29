
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CarbonActivity } from '@/types/carbon';
import { useCarbonActivities } from './useCarbonActivities';
import { useCarbonStorage } from './useCarbonStorage';
import { calculateTotalImpact, calculateCategoryBreakdown } from '@/utils/carbonCalculations';

export function useCarbonFootprint() {
  const { activities, setActivities, handleValueChange } = useCarbonActivities();
  const { user } = useAuth();
  const { 
    isLoading, 
    isSaving, 
    savedData, 
    fetchUserCarbonData, 
    saveResults: saveCarbonData 
  } = useCarbonStorage(activities);

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const data = await fetchUserCarbonData();
        if (data) {
          setActivities(prev => {
            const updatedActivities = [...prev];
            if (data.activities && Array.isArray(data.activities)) {
              const savedActivities = data.activities as Partial<CarbonActivity>[];
              
              savedActivities.forEach((savedActivity) => {
                if (savedActivity.name) {
                  const index = updatedActivities.findIndex(a => a.name === savedActivity.name);
                  if (index !== -1 && typeof savedActivity.value === 'number') {
                    updatedActivities[index].value = savedActivity.value;
                  }
                }
              });
            }
            return updatedActivities;
          });
        }
      };
      
      loadUserData();
    }
  }, [user]);

  const saveResults = async () => {
    await saveCarbonData();
  };

  return { 
    activities, 
    setActivities,
    handleValueChange,
    calculateTotalImpact: () => calculateTotalImpact(activities),
    calculateCategoryBreakdown: () => calculateCategoryBreakdown(activities), 
    saveResults,
    isLoading,
    isSaving,
    savedData
  };
}
