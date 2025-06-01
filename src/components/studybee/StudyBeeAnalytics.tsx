
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useStudyBeeIntegration } from '@/hooks/useStudyBeeIntegration';
import { StudyBeeMetricsCards } from './analytics/StudyBeeMetricsCards';
import { StudyBeeSubjectDistribution } from './analytics/StudyBeeSubjectDistribution';
import { StudyBeeAchievementsList } from './analytics/StudyBeeAchievementsList';
import { StudyBeeInsightsCards } from './analytics/StudyBeeInsightsCards';

export function StudyBeeAnalytics() {
  const { sessions, progress, isConnected } = useStudyBeeIntegration();

  if (!isConnected || !progress) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Connect to Study Bee to view analytics</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate analytics from sessions and progress
  const weeklyGoal = 10; // hours per week
  const weeklyProgress = (progress.sessions_this_week * 1.5) / weeklyGoal * 100; // Estimate 1.5h per session
  
  const averageSessionLength = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length)
    : 0;

  return (
    <div className="space-y-6">
      <StudyBeeMetricsCards 
        progress={progress}
        averageSessionLength={averageSessionLength}
        weeklyProgress={weeklyProgress}
      />

      <StudyBeeSubjectDistribution sessions={sessions} />

      <StudyBeeAchievementsList progress={progress} />

      <StudyBeeInsightsCards progress={progress} />
    </div>
  );
}
