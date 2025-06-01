
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StudyBeeProgress } from '@/integrations/studybee/types';

interface StudyBeeProgressHandlerProps {
  onProgressUpdate?: (progress: StudyBeeProgress) => void;
  setLastSyncTime: (time: Date) => void;
}

export function useStudyBeeProgressHandler({ onProgressUpdate, setLastSyncTime }: StudyBeeProgressHandlerProps) {
  const { user } = useAuth();

  const handleProgressUpdated = async (progressData: any) => {
    console.log('Study Bee progress updated:', progressData);

    try {
      const { error } = await supabase
        .from('study_bee_progress')
        .upsert({
          user_id: user!.id,
          total_study_time: progressData.total_study_time,
          sessions_this_week: progressData.sessions_this_week,
          current_streak: progressData.current_streak,
          longest_streak: progressData.longest_streak,
          subjects_studied: progressData.subjects_studied,
          achievements: progressData.achievements,
          performance_metrics: progressData.performance_metrics,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error syncing progress:', error);
      } else {
        const updatedProgress: StudyBeeProgress = {
          total_study_time: progressData.total_study_time,
          sessions_this_week: progressData.sessions_this_week,
          current_streak: progressData.current_streak,
          longest_streak: progressData.longest_streak,
          subjects_studied: progressData.subjects_studied,
          achievements: progressData.achievements,
          performance_metrics: progressData.performance_metrics
        };
        
        onProgressUpdate?.(updatedProgress);
        setLastSyncTime(new Date());
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  return {
    handleProgressUpdated
  };
}
