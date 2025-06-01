
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useStudyBeeErrorHandler } from '@/hooks/useStudyBeeErrorHandler';

export function useStudyBeeConnection() {
  const { user } = useAuth();
  const { handleError, clearError } = useStudyBeeErrorHandler();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    initializeStudyBeeConnection();
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
      handleError(err, 'connection check');
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
      clearError();
      return true;
    } catch (err) {
      handleError(err, 'connection');
      return false;
    }
  };

  return {
    isConnected,
    loading,
    connectToStudyBee,
    initializeStudyBeeConnection
  };
}
