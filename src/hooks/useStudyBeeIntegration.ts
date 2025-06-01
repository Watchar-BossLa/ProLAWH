
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

export function useStudyBeeIntegration() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [sessions, setSessions] = useState<StudyBeeSession[]>([]);
  const [progress, setProgress] = useState<StudyBeeProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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
        const newSession = payload.new as unknown as StudyBeeSession;
        setSessions(prev => [newSession, ...prev.slice(0, 9)]);
        setLastSyncTime(new Date());
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
        const updatedProgress = payload.new as unknown as StudyBeeProgress;
        setProgress(updatedProgress);
        setLastSyncTime(new Date());
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsSubscription);
      supabase.removeChannel(progressSubscription);
    };
  }, [user]);

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
      console.error('Error checking Study Bee connection:', err);
      setError('Failed to connect to Study Bee');
    }
  };

  const fetchStudyBeeData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch recent sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_bee_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      } else if (sessionsData) {
        setSessions(sessionsData as unknown as StudyBeeSession[]);
      }

      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('study_bee_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
      } else if (progressData) {
        setProgress(progressData as unknown as StudyBeeProgress);
      }

    } catch (err) {
      console.error('Error fetching Study Bee data:', err);
      setError('Failed to fetch study data');
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
      console.error('Error generating auth token:', err);
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
      return true;
    } catch (err) {
      console.error('Error connecting to Study Bee:', err);
      setError('Failed to connect to Study Bee');
      return false;
    }
  };

  const syncData = useCallback(async () => {
    if (!isConnected) return;
    
    await fetchStudyBeeData();
    setLastSyncTime(new Date());
  }, [isConnected, user]);

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
