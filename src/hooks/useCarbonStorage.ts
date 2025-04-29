
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CarbonActivity, SavedCarbonData, CategoryBreakdown } from '@/types/carbon';
import { calculateTotalImpact, calculateCategoryBreakdown } from '@/utils/carbonCalculations';

export function useCarbonStorage(activities: CarbonActivity[]) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState<SavedCarbonData | null>(null);

  const fetchUserCarbonData = async () => {
    if (!user) {
      setIsLoading(false);
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('carbon_footprint_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching carbon data:', error);
      }
      
      setIsLoading(false);
      
      if (data) {
        return data as SavedCarbonData;
      }
      
      return null;
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      return null;
    }
  };

  const saveResults = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your carbon footprint data.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      const totalImpact = calculateTotalImpact(activities);
      const categoryBreakdown = calculateCategoryBreakdown(activities);
      
      const { error } = await supabase
        .from('carbon_footprint_data')
        .insert({
          user_id: user.id,
          total_impact: totalImpact,
          activities: activities.map(a => ({
            name: a.name,
            category: a.category,
            icon: a.icon,
            value: a.value,
            impactPerUnit: a.impactPerUnit,
            unit: a.unit,
            frequency: a.frequency
          })),
          category_breakdown: categoryBreakdown
        });
      
      if (error) {
        throw error;
      }
      
      const newSavedData: SavedCarbonData = {
        total_impact: totalImpact,
        activities: activities,
        category_breakdown: categoryBreakdown,
        created_at: new Date().toISOString()
      };
      
      setSavedData(newSavedData);
      
      toast({
        title: "Carbon Footprint Saved",
        description: "Your carbon footprint has been calculated and saved to your profile."
      });
      
    } catch (error: any) {
      console.error('Error saving carbon data:', error);
      toast({
        title: "Error Saving Data",
        description: error.message || "Failed to save carbon footprint data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    savedData,
    fetchUserCarbonData,
    saveResults
  };
}
