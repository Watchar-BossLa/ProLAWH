
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';
import { useStudyBeeErrorHandler } from '@/hooks/useStudyBeeErrorHandler';
import { StudyBeeDataValidator } from '@/utils/studybee/dataValidator';

interface UseStudyBeeRealtimeProps {
  onSessionUpdate: (session: StudyBeeSession) => void;
  onProgressUpdate: (progress: StudyBeeProgress) => void;
}

export function useStudyBeeRealtime({ onSessionUpdate, onProgressUpdate }: UseStudyBeeRealtimeProps) {
  const { user } = useAuth();
  const { handleError, clearError } = useStudyBeeErrorHandler();

  useEffect(() => {
    if (!user) return;
    
    // Set up real-time subscriptions
    const sessionsSubscription = supabase
      .channel('study-bee-sessions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'study_bee_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        try {
          const validation = StudyBeeDataValidator.validateSession(payload.new);
          if (validation.isValid && validation.sanitizedData) {
            const newSession = validation.sanitizedData as StudyBeeSession;
            onSessionUpdate(newSession);
            clearError();
          } else {
            console.warn('Invalid session data received:', validation.errors);
          }
        } catch (err) {
          handleError(err, 'real-time session update');
        }
      })
      .subscribe();

    const progressSubscription = supabase
      .channel('study-bee-progress')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'study_bee_progress',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        try {
          const validation = StudyBeeDataValidator.validateProgress(payload.new);
          if (validation.isValid && validation.sanitizedData) {
            const updatedProgress = validation.sanitizedData as StudyBeeProgress;
            onProgressUpdate(updatedProgress);
            clearError();
          } else {
            console.warn('Invalid progress data received:', validation.errors);
          }
        } catch (err) {
          handleError(err, 'real-time progress update');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsSubscription);
      supabase.removeChannel(progressSubscription);
    };
  }, [user, onSessionUpdate, onProgressUpdate, handleError, clearError]);
}
