
import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type ActivityType = 
  | 'page_view' 
  | 'learning_content_engagement'
  | 'skill_development'
  | 'mentorship_interaction'
  | 'network_connection'
  | 'opportunity_interest'
  | 'challenge_completion'
  | 'career_twin_interaction';

interface ActivityMetadata {
  [key: string]: any;
}

export function useActivityTracker() {
  const { user } = useAuth();
  
  const trackActivity = useCallback(async (
    activityType: ActivityType, 
    metadata: ActivityMetadata = {}
  ) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          metadata
        });
      
      // In debug mode, log the activity
      if (process.env.NODE_ENV === 'development') {
        console.log(`Activity tracked: ${activityType}`, metadata);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  // Track page views automatically
  const trackPageView = useCallback(() => {
    if (!user) return;
    
    const path = window.location.pathname;
    trackActivity('page_view', { path });
  }, [user, trackActivity]);
  
  // Track initial page view on mount
  useEffect(() => {
    if (user) {
      trackPageView();
    }
  }, [user, trackPageView]);
  
  // Listen for router changes to track page views
  useEffect(() => {
    // This would normally use a router event listener
    // For React Router: history.listen(trackPageView);
    // We'll leave this as a placeholder since the implementation
    // depends on the specific router being used
  }, [trackPageView]);

  return {
    trackActivity,
  };
}
