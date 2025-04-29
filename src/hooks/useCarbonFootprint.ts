
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CarbonActivity {
  name: string;
  category: string;
  icon: string;
  impactPerUnit: number;
  unit: string;
  frequency: string;
  value: number;
  maxValue: number;
}

export function useCarbonFootprint() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<CarbonActivity[]>([
    { 
      name: "Car Travel", 
      category: "Transportation", 
      icon: "car", 
      impactPerUnit: 2.3, 
      unit: "km", 
      frequency: "weekly",
      value: 50,
      maxValue: 500
    },
    { 
      name: "Electricity Usage", 
      category: "Home", 
      icon: "home", 
      impactPerUnit: 0.5, 
      unit: "kWh", 
      frequency: "weekly",
      value: 100,
      maxValue: 300
    },
    { 
      name: "Meat Consumption", 
      category: "Food", 
      icon: "shopping-bag", 
      impactPerUnit: 6.0, 
      unit: "meals", 
      frequency: "weekly",
      value: 3,
      maxValue: 21
    },
    { 
      name: "Plant-Based Meals", 
      category: "Food", 
      icon: "leaf", 
      impactPerUnit: -1.5, 
      unit: "meals", 
      frequency: "weekly",
      value: 5,
      maxValue: 21
    },
    { 
      name: "Public Transit", 
      category: "Transportation", 
      icon: "bus", 
      impactPerUnit: -0.8, 
      unit: "trips", 
      frequency: "weekly",
      value: 3,
      maxValue: 20
    },
    { 
      name: "Renewable Energy", 
      category: "Home", 
      icon: "sun", 
      impactPerUnit: -1.2, 
      unit: "kWh", 
      frequency: "weekly",
      value: 20,
      maxValue: 200
    },
    { 
      name: "Recycling", 
      category: "Waste", 
      icon: "recycle", 
      impactPerUnit: -0.3, 
      unit: "kg", 
      frequency: "weekly",
      value: 2,
      maxValue: 20
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserCarbonData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserCarbonData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('carbon_footprint_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching carbon data:', error);
      }
      
      if (data) {
        setSavedData(data);
        setActivities(prev => {
          const updatedActivities = [...prev];
          // Fix: Type guard for activities as array before using forEach
          if (data.activities && Array.isArray(data.activities)) {
            data.activities.forEach((savedActivity: CarbonActivity) => {
              const index = updatedActivities.findIndex(a => a.name === savedActivity.name);
              if (index !== -1) {
                updatedActivities[index].value = savedActivity.value;
              }
            });
          }
          return updatedActivities;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (index: number, newValue: number) => {
    const newActivities = [...activities];
    newActivities[index].value = newValue;
    setActivities(newActivities);
  };

  const calculateTotalImpact = () => {
    return activities.reduce((total, activity) => {
      // Convert to monthly impact
      const monthlyMultiplier = activity.frequency === 'weekly' ? 4.3 : 1;
      return total + (activity.impactPerUnit * activity.value * monthlyMultiplier);
    }, 0);
  };

  const calculateCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {};
    
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
      const totalImpact = calculateTotalImpact();
      const categoryBreakdown = calculateCategoryBreakdown();
      
      // Fix: Type casting for database compatibility
      const { error } = await supabase
        .from('carbon_footprint_data')
        .insert({
          user_id: user.id,
          total_impact: totalImpact,
          activities: activities as unknown as Record<string, unknown>,
          category_breakdown: categoryBreakdown as unknown as Record<string, unknown>
        });
      
      if (error) {
        throw error;
      }
      
      setSavedData({
        total_impact: totalImpact,
        activities: activities,
        category_breakdown: categoryBreakdown,
        created_at: new Date().toISOString()
      });
      
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
    activities, 
    setActivities,
    handleValueChange,
    calculateTotalImpact,
    calculateCategoryBreakdown, 
    saveResults,
    isLoading,
    isSaving,
    savedData
  };
}
