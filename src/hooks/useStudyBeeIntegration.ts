import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';
import { useStudyBeeErrorHandler } from './useStudyBeeErrorHandler';
import { useStudyBeeCache } from './useStudyBeeCache';
import { StudyBeeDataValidator } from '@/utils/studybee/dataValidator';

export function useStudyBeeIntegration() {
  const { user } = useAuth();
  const { handleError, retry, clearError } = useStudyBeeErrorHandler();
  const { 
    cache, 
    getCachedSessions, 
    getCachedProgress, 
    addSession, 
    updateProgress: updateCachedProgress,
    invalidateCache 
  } = useStudyBeeCache();

  const [isConnected, setIsConnected] = useState(false);
  const [sessions, setSessions] = useState<StudyBeeSession[]>([]);
  const [progress, setProgress] = useState<StudyBeeProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Load cached data first for better UX
  useEffect(() => {
    const cachedSessions = getCachedSessions();
    const cachedProgress = getCachedProgress();
    
    if (cachedSessions) setSessions(cachedSessions);
    if (cachedProgress) setProgress(cachedProgress);
    if (cache.lastSyncTime) setLastSyncTime(cache.lastSyncTime);
  }, [getCachedSessions, getCachedProgress, cache.lastSyncTime]);

  useEffect(() => {
    if (!user) return;

    initializeStudyBeeConnection();
    fetchStudyBeeData();
    
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
            setSessions(prev => [newSession, ...prev.slice(0, 9)]);
            addSession(newSession);
            setLastSyncTime(new Date());
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
            setProgress(updatedProgress);
            updateCachedProgress(updatedProgress);
            setLastSyncTime(new Date());
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
  }, [user, handleError, clearError, addSession, updateCachedProgress]);

  const initializeStudyBeeConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('study_bee_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsConnected(!!data);
    } catch (err) {
      const studyBeeError = handleError(err, 'connection check');
      setError(studyBeeError.message);
    }
  };

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

      // Fetch fresh data with timeout
      const fetchWithTimeout = async (promise: Promise<any>, timeout = 10000) => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        );
        return Promise.race([promise, timeoutPromise]);
      };

      // Fetch recent sessions
      const sessionsPromise = supabase
        .from('study_bee_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10);

      const { data: sessionsData, error: sessionsError } = await fetchWithTimeout(sessionsPromise);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      } else if (sessionsData) {
        // Validate all sessions
        const validSessions = sessionsData
          .map(session => StudyBeeDataValidator.validateSession(session))
          .filter(validation => validation.isValid)
          .map(validation => validation.sanitizedData as StudyBeeSession);

        setSessions(validSessions);
        validSessions.forEach(session => addSession(session));
      }

      // Fetch progress data
      const progressPromise = supabase
        .from('study_bee_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: progressData, error: progressError } = await fetchWithTimeout(progressPromise);

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
      } else if (progressData) {
        const validation = StudyBeeDataValidator.validateProgress(progressData);
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

  const generateAuthToken = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('generate-studybee-token', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      return data.token;
    } catch (err) {
      handleError(err, 'token generation');
      return null;
    }
  };

  const connectToStudyBee = async () => {
    const token = await generateAuthToken();
    if (!token) return false;

    try {
      const { error } = await supabase
        .from('study_bee_integrations')
        .upsert({
          user_id: user?.id,
          auth_token: token,
          connected_at: new Date().toISOString(),
          is_active: true
        });

      if (error) throw error;

      setIsConnected(true);
      setLastSyncTime(new Date());
      invalidateCache(); // Clear cache to force fresh data
      return true;
    } catch (err) {
      const studyBeeError = handleError(err, 'connection');
      setError(studyBeeError.message);
      return false;
    }
  };

  const syncData = useCallback(async () => {
    if (!isConnected) return;
    
    await retry(fetchStudyBeeData);
  }, [isConnected, retry]);

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
    isConnected,
    sessions,
    progress,
    loading,
    error,
    lastSyncTime,
    connectToStudyBee,
    refreshData: fetchStudyBeeData,
    syncData,
    studyStats: getStudyStats()
  };
}
