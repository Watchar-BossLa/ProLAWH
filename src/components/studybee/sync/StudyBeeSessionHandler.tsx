
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StudyBeeSession } from '@/integrations/studybee/types';

interface StudyBeeSessionHandlerProps {
  onSessionUpdate?: (session: StudyBeeSession) => void;
  setLastSyncTime: (time: Date) => void;
}

export function useStudyBeeSessionHandler({ onSessionUpdate, setLastSyncTime }: StudyBeeSessionHandlerProps) {
  const { user } = useAuth();

  const handleSessionStarted = async (sessionData: any) => {
    console.log('Study Bee session started:', sessionData);
    
    toast({
      title: "Study Session Started",
      description: `You've started studying ${sessionData.subject}`,
    });

    // Create preliminary session record
    const preliminarySession: StudyBeeSession = {
      id: sessionData.session_id,
      user_id: user!.id,
      session_type: sessionData.type || 'study',
      subject: sessionData.subject,
      duration_minutes: 0,
      progress_percentage: 0,
      notes_count: 0,
      started_at: new Date().toISOString(),
      metadata: sessionData.metadata || {}
    };

    onSessionUpdate?.(preliminarySession);
    setLastSyncTime(new Date());
  };

  const handleSessionCompleted = async (sessionData: any) => {
    console.log('Study Bee session completed:', sessionData);
    
    toast({
      title: "Study Session Completed!",
      description: `Great work! You studied ${sessionData.subject} for ${sessionData.duration_minutes} minutes.`,
    });

    // Sync completed session to database
    try {
      const { error } = await supabase
        .from('study_bee_sessions')
        .upsert({
          session_id: sessionData.session_id,
          user_id: user!.id,
          session_type: sessionData.type,
          subject: sessionData.subject,
          duration_minutes: sessionData.duration_minutes,
          progress_percentage: sessionData.progress_percentage,
          notes_count: sessionData.notes_count || 0,
          quiz_score: sessionData.quiz_score,
          started_at: sessionData.started_at,
          completed_at: sessionData.completed_at,
          metadata: sessionData.metadata || {}
        });

      if (error) {
        console.error('Error syncing session:', error);
      } else {
        const completedSession: StudyBeeSession = {
          id: sessionData.session_id,
          user_id: user!.id,
          session_type: sessionData.type,
          subject: sessionData.subject,
          duration_minutes: sessionData.duration_minutes,
          progress_percentage: sessionData.progress_percentage,
          notes_count: sessionData.notes_count || 0,
          quiz_score: sessionData.quiz_score,
          started_at: sessionData.started_at,
          completed_at: sessionData.completed_at,
          metadata: sessionData.metadata || {}
        };
        
        onSessionUpdate?.(completedSession);
        setLastSyncTime(new Date());
      }
    } catch (error) {
      console.error('Error syncing completed session:', error);
    }
  };

  return {
    handleSessionStarted,
    handleSessionCompleted
  };
}
