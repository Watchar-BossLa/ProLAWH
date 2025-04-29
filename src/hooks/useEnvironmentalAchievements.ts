
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  earned: boolean;
  earned_at?: string;
}

// Define the requirement value interface to ensure type safety
interface RequirementValue {
  minimum?: number;
  category?: string;
  count?: number;
}

export function useEnvironmentalAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      
      // Get all environmental achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('environmental_achievements')
        .select('*');
      
      if (achievementsError) throw achievementsError;
      
      // Get user's earned achievements
      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user?.id);
      
      if (userAchievementsError) throw userAchievementsError;
      
      // Combine the data
      const combinedAchievements = achievementsData.map(achievement => {
        const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon_name: achievement.icon_name,
          earned: !!userAchievement,
          earned_at: userAchievement?.earned_at
        };
      });
      
      setAchievements(combinedAchievements);
      
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAchievementEligibility = async (achievementId: string) => {
    if (!user) return false;
    
    try {
      // Get the achievement details
      const { data: achievement, error } = await supabase
        .from('environmental_achievements')
        .select('*')
        .eq('id', achievementId)
        .single();
      
      if (error) throw error;
      
      // Different logic based on the achievement requirement type
      switch (achievement.requirement_type) {
        case 'carbon_reduction': {
          const { data, error: carbonError } = await supabase
            .from('carbon_footprint_data')
            .select('total_impact')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (carbonError && carbonError.code !== 'PGRST116') throw carbonError;
          
          // Fix: Parse the value explicitly with a type guard
          const requirementValue = achievement.requirement_value as unknown as RequirementValue;
          const minimumReduction = requirementValue?.minimum || 0;
          
          // If user has carbon data and meets the minimum reduction
          return data && data.total_impact <= -minimumReduction;
        }
        
        // Add other requirement checks as needed
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking achievement eligibility:', error);
      return false;
    }
  };

  const earnAchievement = async (achievementId: string) => {
    if (!user) return;
    
    try {
      // Check if already earned
      const exists = achievements.find(a => a.id === achievementId && a.earned);
      if (exists) return;
      
      // Check eligibility
      const isEligible = await checkAchievementEligibility(achievementId);
      if (!isEligible) return;
      
      // Record the achievement
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId
        });
      
      if (error) throw error;
      
      // Update local state
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievementId 
            ? { ...a, earned: true, earned_at: new Date().toISOString() } 
            : a
        )
      );
      
      const achievement = achievements.find(a => a.id === achievementId);
      
      toast({
        title: "Achievement Unlocked!",
        description: achievement?.name || "You've earned a new achievement!"
      });
      
    } catch (error) {
      console.error('Error earning achievement:', error);
    }
  };

  return {
    achievements,
    isLoading,
    earnAchievement,
    checkAchievementEligibility
  };
}
