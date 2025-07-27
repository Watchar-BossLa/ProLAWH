
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyBeeProgress } from '@/integrations/studybee/types';
import { Target, Clock, Brain, Zap } from "lucide-react";

interface StudyBeeMetricsCardsProps {
  progress: StudyBeeProgress;
  averageSessionLength: number;
  weeklyProgress: number;
}

export function StudyBeeMetricsCards({ progress, averageSessionLength, weeklyProgress }: StudyBeeMetricsCardsProps) {
  const studyEfficiency = progress.performance_metrics.focus_score || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(weeklyProgress)}%</div>
          <Progress value={weeklyProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {progress.sessions_this_week} sessions this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageSessionLength}m</div>
          <p className="text-xs text-muted-foreground">
            Total: {Math.round(progress.total_study_time / 60)}h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Efficiency</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studyEfficiency}%</div>
          <p className="text-xs text-muted-foreground">
            Focus & retention score
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.current_streak}</div>
          <p className="text-xs text-muted-foreground">
            Best: {progress.longest_streak} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
