
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CarbonActivity, SavedCarbonData } from '@/types/carbon';

export function useCarbonStorage(activities: CarbonActivity[]) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState<SavedCarbonData | null>(null);
  const { user } = useAuth();

  const fetchUserCarbonData = async () => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('carbon_footprint_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          console.error('Error fetching carbon data:', error);
        }
        return null;
      }
      
      // Convert the data to the expected type
      const convertedData: SavedCarbonData = {
        total_impact: data.total_impact,
        activities: Array.isArray(data.activities) ? data.activities as CarbonActivity[] : [],
        category_breakdown: (data.category_breakdown as any) || {},
        created_at: data.created_at
      };
      
      setSavedData(convertedData);
      return convertedData;
    } catch (error) {
      console.error('Error in fetchUserCarbonData:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveResults = async () => {
    if (!user) return null;
    
    setIsSaving(true);
    try {
      const totalImpact = activities.reduce((sum, activity) => {
        const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
        return sum + (activity.impactPerUnit * activity.value * monthlyMultiplier);
      }, 0);
      
      const categoryBreakdown: { [key: string]: number } = {};
      activities.forEach(activity => {
        const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
        const impact = activity.impactPerUnit * activity.value * monthlyMultiplier;
        
        if (categoryBreakdown[activity.category]) {
          categoryBreakdown[activity.category] += impact;
        } else {
          categoryBreakdown[activity.category] = impact;
        }
      });

      const { data, error } = await supabase
        .from('carbon_footprint_data')
        .insert([{
          user_id: user.id,
          total_impact: totalImpact,
          activities: activities,
          category_breakdown: categoryBreakdown
        }])
        .select();
      
      if (error) {
        console.error('Error saving carbon data:', error);
        return null;
      }
      
      // Convert the data to the expected type
      const convertedData: SavedCarbonData = {
        total_impact: data[0].total_impact,
        activities: Array.isArray(data[0].activities) ? data[0].activities as CarbonActivity[] : [],
        category_breakdown: (data[0].category_breakdown as any) || {},
        created_at: data[0].created_at
      };
      
      setSavedData(convertedData);
      return convertedData;
    } catch (error) {
      console.error('Error in saveResults:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCarbonData();
    }
  }, [user]);

  return {
    isLoading,
    isSaving,
    savedData,
    fetchUserCarbonData,
    saveResults
  };
}
