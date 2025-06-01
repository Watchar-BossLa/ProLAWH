
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudyBeeIntegration } from '@/hooks/useStudyBeeIntegration';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  BookOpen, 
  Brain,
  Calendar,
  Award,
  Zap 
} from "lucide-react";

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
  
  const subjectDistribution = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration_minutes;
    return acc;
  }, {} as Record<string, number>);

  const topSubjects = Object.entries(subjectDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const averageSessionLength = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length)
    : 0;

  const studyEfficiency = progress.performance_metrics.focus_score || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
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

      {/* Subject Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Top Study Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSubjects.map(([subject, minutes], index) => (
              <div key={subject} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{subject}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(minutes / 60 * 10) / 10}h
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {progress.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {progress.achievements.slice(0, 4).map((achievement, index) => (
                <Badge key={index} variant="secondary" className="justify-start">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Pattern Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Study Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Retention Rate</p>
                <p className="text-sm text-muted-foreground">Knowledge retention from sessions</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{progress.performance_metrics.retention_rate}%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Quiz Performance</p>
                <p className="text-sm text-muted-foreground">Average quiz scores</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{progress.performance_metrics.quiz_average}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Study Diversity</p>
                <p className="text-sm text-muted-foreground">Different subjects studied</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{progress.subjects_studied.length}</div>
                <p className="text-xs text-muted-foreground">subjects</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
