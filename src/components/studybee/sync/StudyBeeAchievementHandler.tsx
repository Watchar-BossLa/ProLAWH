
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useStudyBeeAchievementHandler() {
  const { user } = useAuth();

  const handleAchievementUnlocked = (achievementData: any) => {
    toast({
      title: "🎉 Achievement Unlocked!",
      description: `You've earned: ${achievementData.name}`,
      duration: 5000,
    });

    // Log achievement to ProLawh activity system
    supabase
      .from('user_activity_logs')
      .insert({
        user_id: user!.id,
        activity_type: 'study_bee_achievement',
        metadata: {
          achievement_name: achievementData.name,
          achievement_type: achievementData.type,
          earned_at: achievementData.earned_at
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error logging achievement:', error);
      });
  };

  const handleStreakUpdated = (streakData: any) => {
    if (streakData.current_streak > (streakData.previous_streak || 0)) {
      toast({
        title: `🔥 ${streakData.current_streak} Day Streak!`,
        description: "Keep up the great work!",
      });
    }
  };

  return {
    handleAchievementUnlocked,
    handleStreakUpdated
  };
}
