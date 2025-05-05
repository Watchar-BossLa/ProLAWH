
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useActivityTracker() {
  const { user } = useAuth();

  const trackActivity = useCallback((activityType: string, metadata: Record<string, any> = {}) => {
    if (!user) return;

    try {
      // Log user activity to the database
      supabase.from('user_activity_logs').insert({
        user_id: user.id,
        activity_type: activityType,
        metadata
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  return { trackActivity };
}
