
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudyBeeSessionHandler } from './StudyBeeSessionHandler';
import { useStudyBeeProgressHandler } from './StudyBeeProgressHandler';
import { useStudyBeeAchievementHandler } from './StudyBeeAchievementHandler';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

interface StudyBeeMessageHandlerProps {
  onSessionUpdate?: (session: StudyBeeSession) => void;
  onProgressUpdate?: (progress: StudyBeeProgress) => void;
  setLastSyncTime: (time: Date) => void;
  setIsConnected: (connected: boolean) => void;
}

export function useStudyBeeMessageHandler({
  onSessionUpdate,
  onProgressUpdate,
  setLastSyncTime,
  setIsConnected
}: StudyBeeMessageHandlerProps) {
  const { user } = useAuth();
  
  const { handleSessionStarted, handleSessionCompleted } = useStudyBeeSessionHandler({
    onSessionUpdate,
    setLastSyncTime
  });
  
  const { handleProgressUpdated } = useStudyBeeProgressHandler({
    onProgressUpdate,
    setLastSyncTime
  });
  
  const { handleAchievementUnlocked, handleStreakUpdated } = useStudyBeeAchievementHandler();

  useEffect(() => {
    if (!user) return;

    // Listen for real-time updates from Study Bee
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.studybee.info') return;

      try {
        const message = event.data;
        
        switch (message.type) {
          case 'session_started':
            handleSessionStarted(message.data);
            break;
          case 'session_completed':
            handleSessionCompleted(message.data);
            break;
          case 'progress_updated':
            handleProgressUpdated(message.data);
            break;
          case 'achievement_unlocked':
            handleAchievementUnlocked(message.data);
            break;
          case 'study_streak_updated':
            handleStreakUpdated(message.data);
            break;
        }
      } catch (error) {
        console.error('Error processing Study Bee sync message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    setIsConnected(true);

    return () => {
      window.removeEventListener('message', handleMessage);
      setIsConnected(false);
    };
  }, [user, handleSessionStarted, handleSessionCompleted, handleProgressUpdated, handleAchievementUnlocked, handleStreakUpdated, setIsConnected]);
}
