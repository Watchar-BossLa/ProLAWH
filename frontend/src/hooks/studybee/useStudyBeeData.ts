
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';
import { useStudyBeeErrorHandler } from '@/hooks/useStudyBeeErrorHandler';
import { useStudyBeeCache } from '@/hooks/useStudyBeeCache';
import { StudyBeeDataValidator } from '@/utils/studybee/dataValidator';

export function useStudyBeeData() {
  const { user } = useAuth();
  const { handleError } = useStudyBeeErrorHandler();
  const { 
    getCachedSessions, 
    getCachedProgress, 
    addSession, 
    updateProgress: updateCachedProgress,
    invalidateCache 
  } = useStudyBeeCache();

  const [sessions, setSessions] = useState<StudyBeeSession[]>([]);
  const [progress, setProgress] = useState<StudyBeeProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const fetchStudyBeeData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to use cached data first if available
      const cachedSessions = getCachedSessions(2 * 60 * 1000); // 2 minutes
      const cachedProgress = getCachedProgress(2 * 60 * 1000);

      if (cachedSessions && cachedProgress) {
        setSessions(cachedSessions);
        setProgress(cachedProgress);
        setLoading(false);
        return;
      }

      // Fetch recent sessions
      const sessionsResult = await supabase
        .from('study_bee_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10);

      if (sessionsResult.error) {
        console.error('Error fetching sessions:', sessionsResult.error);
      } else if (sessionsResult.data) {
        // Validate all sessions
        const validSessions = sessionsResult.data
          .map(session => StudyBeeDataValidator.validateSession(session))
          .filter(validation => validation.isValid)
          .map(validation => validation.sanitizedData as StudyBeeSession);

        setSessions(validSessions);
        validSessions.forEach(session => addSession(session));
      }

      // Fetch progress data
      const progressResult = await supabase
        .from('study_bee_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressResult.error && progressResult.error.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressResult.error);
      } else if (progressResult.data) {
        const validation = StudyBeeDataValidator.validateProgress(progressResult.data);
        if (validation.isValid && validation.sanitizedData) {
          const validProgress = validation.sanitizedData as StudyBeeProgress;
          setProgress(validProgress);
          updateCachedProgress(validProgress);
        }
      }

      setLastSyncTime(new Date());

    } catch (err) {
      const studyBeeError = handleError(err, 'data fetch');
      setError(studyBeeError.message);
      
      // Fallback to cached data on error
      const cachedSessions = getCachedSessions();
      const cachedProgress = getCachedProgress();
      if (cachedSessions) setSessions(cachedSessions);
      if (cachedProgress) setProgress(cachedProgress);
    } finally {
      setLoading(false);
    }
  };

  const getStudyStats = useCallback(() => {
    if (!progress || sessions.length === 0) return null;

    const thisWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.started_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const averageSessionLength = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length
      : 0;

    const totalQuizzes = sessions.filter(s => s.session_type === 'quiz').length;
    const averageQuizScore = totalQuizzes > 0
      ? sessions
          .filter(s => s.session_type === 'quiz' && s.quiz_score)
          .reduce((sum, s) => sum + (s.quiz_score || 0), 0) / totalQuizzes
      : 0;

    return {
      thisWeekSessions: thisWeekSessions.length,
      averageSessionLength: Math.round(averageSessionLength),
      totalQuizzes,
      averageQuizScore: Math.round(averageQuizScore),
      currentStreak: progress.current_streak,
      longestStreak: progress.longest_streak,
      totalStudyTime: Math.round(progress.total_study_time / 60), // Convert to hours
      focusScore: progress.performance_metrics.focus_score,
      retentionRate: progress.performance_metrics.retention_rate
    };
  }, [progress, sessions]);

  return {
    sessions,
    progress,
    loading,
    error,
    lastSyncTime,
    fetchStudyBeeData,
    studyStats: getStudyStats(),
    invalidateCache,
    setSessions,
    setProgress,
    setLastSyncTime
  };
}
