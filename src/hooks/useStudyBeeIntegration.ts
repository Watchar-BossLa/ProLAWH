
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!user) return;

    initializeStudyBeeConnection();
    fetchStudyBeeData();
  }, [user]);

  const initializeStudyBeeConnection = async () => {
    try {
      // Check if user has Study Bee integration enabled
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
      // Create integration record
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
      return true;
    } catch (err) {
      console.error('Error connecting to Study Bee:', err);
      setError('Failed to connect to Study Bee');
      return false;
    }
  };

  return {
    isConnected,
    sessions,
    progress,
    loading,
    error,
    connectToStudyBee,
    refreshData: fetchStudyBeeData
  };
}
