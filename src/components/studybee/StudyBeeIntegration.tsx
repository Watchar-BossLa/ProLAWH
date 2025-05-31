
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStudyBeeIntegration } from '@/hooks/useStudyBeeIntegration';
import { useAuth } from '@/hooks/useAuth';
import { 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function StudyBeeIntegration() {
  const { user } = useAuth();
  const { 
    isConnected, 
    sessions, 
    progress, 
    loading, 
    error, 
    connectToStudyBee,
    refreshData 
  } = useStudyBeeIntegration();
  
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    const success = await connectToStudyBee();
    if (success) {
      await refreshData();
    }
    setConnecting(false);
  };

  const launchStudyBee = () => {
    // Use a different parameter for development users
    const userParam = user?.id === 'dev-user-123' 
      ? 'dev-user' 
      : user?.id ? encodeURIComponent(user.id) : '';
    
    const studyBeeUrl = userParam
      ? `https://www.studybee.info/dashboard?user=${userParam}`
      : 'https://www.studybee.info';
    
    window.open(studyBeeUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse">Loading Study Bee integration...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Connect to Study Bee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect your Study Bee account to sync your study sessions, track progress, 
            and get personalized recommendations within ProLawh.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleConnect} disabled={connecting}>
              {connecting ? 'Connecting...' : 'Connect Study Bee'}
            </Button>
            <Button variant="outline" onClick={launchStudyBee}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Study Bee
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Study Bee Connected
            </CardTitle>
            <Button variant="outline" size="sm" onClick={launchStudyBee}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Launch Study Bee
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.current_streak}</div>
              <p className="text-xs text-muted-foreground">
                days • Best: {progress.longest_streak}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progress.total_study_time / 60)}h</div>
              <p className="text-xs text-muted-foreground">
                {progress.sessions_this_week} sessions this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.performance_metrics.focus_score}%</div>
              <p className="text-xs text-muted-foreground">
                Avg retention: {progress.performance_metrics.retention_rate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.performance_metrics.quiz_average}%</div>
              <p className="text-xs text-muted-foreground">
                {progress.subjects_studied.length} subjects studied
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Badge variant={session.session_type === 'quiz' ? 'default' : 'secondary'}>
                        {session.session_type}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{session.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration_minutes} min • {session.progress_percentage}% complete
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.started_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No recent sessions found</p>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      {progress?.achievements && progress.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.achievements.slice(0, 6).map((achievement, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
