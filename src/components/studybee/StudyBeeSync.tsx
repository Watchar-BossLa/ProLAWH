
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

interface StudyBeeSyncProps {
  onSessionUpdate?: (session: StudyBeeSession) => void;
  onProgressUpdate?: (progress: StudyBeeProgress) => void;
}

export function StudyBeeSync({ onSessionUpdate, onProgressUpdate }: StudyBeeSyncProps) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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
  }, [user]);

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

  const handleProgressUpdated = async (progressData: any) => {
    console.log('Study Bee progress updated:', progressData);

    try {
      const { error } = await supabase
        .from('study_bee_progress')
        .upsert({
          user_id: user!.id,
          total_study_time: progressData.total_study_time,
          sessions_this_week: progressData.sessions_this_week,
          current_streak: progressData.current_streak,
          longest_streak: progressData.longest_streak,
          subjects_studied: progressData.subjects_studied,
          achievements: progressData.achievements,
          performance_metrics: progressData.performance_metrics,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error syncing progress:', error);
      } else {
        const updatedProgress: StudyBeeProgress = {
          total_study_time: progressData.total_study_time,
          sessions_this_week: progressData.sessions_this_week,
          current_streak: progressData.current_streak,
          longest_streak: progressData.longest_streak,
          subjects_studied: progressData.subjects_studied,
          achievements: progressData.achievements,
          performance_metrics: progressData.performance_metrics
        };
        
        onProgressUpdate?.(updatedProgress);
        setLastSyncTime(new Date());
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  const handleAchievementUnlocked = (achievementData: any) => {
    toast({
      title: "🎉 Achievement Unlocked!",
      description: `You've earned: ${achievementData.name}`,
      duration: 5000,
    });

    // Log achievement to ProLawh activity system
    supabase
      .from('user_activity_logs')
      .insert({
        user_id: user!.id,
        activity_type: 'study_bee_achievement',
        metadata: {
          achievement_name: achievementData.name,
          achievement_type: achievementData.type,
          earned_at: achievementData.earned_at
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error logging achievement:', error);
      });
  };

  const handleStreakUpdated = (streakData: any) => {
    if (streakData.current_streak > (streakData.previous_streak || 0)) {
      toast({
        title: `🔥 ${streakData.current_streak} Day Streak!`,
        description: "Keep up the great work!",
      });
    }
  };

  // Send study goals to Study Bee
  const syncStudyGoals = async (goals: any[]) => {
    const studyBeeWindow = window.open('', 'studybee');
    if (studyBeeWindow) {
      studyBeeWindow.postMessage({
        type: 'sync_goals',
        data: { goals }
      }, 'https://www.studybee.info');
    }
  };

  return (
    <div className="hidden">
      {/* This component handles background sync - no UI */}
      {isConnected && lastSyncTime && (
        <div className="text-xs text-muted-foreground">
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
