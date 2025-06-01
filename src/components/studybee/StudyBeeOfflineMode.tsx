
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, RefreshCw, Clock, BookOpen } from "lucide-react";
import { useStudyBeeCache } from '@/hooks/useStudyBeeCache';

interface StudyBeeOfflineModeProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function StudyBeeOfflineMode({ onRetry, isRetrying }: StudyBeeOfflineModeProps) {
  const { cache, isStale } = useStudyBeeCache();

  return (
    <div className="space-y-6">
      <Alert>
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium">Study Bee Offline</p>
            <p className="text-sm mt-1">
              Showing cached data. You'll see live updates when connection is restored.
            </p>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              disabled={isRetrying}
              className="ml-4"
            >
              {isRetrying ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {/* Cached Progress Overview */}
      {cache.progress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="opacity-75">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cache.progress.current_streak}</div>
              <p className="text-xs text-muted-foreground">
                days • Best: {cache.progress.longest_streak}
              </p>
              <Badge variant="secondary" className="mt-1">Cached</Badge>
            </CardContent>
          </Card>

          <Card className="opacity-75">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cache.progress.sessions_this_week}</div>
              <p className="text-xs text-muted-foreground">
                sessions
              </p>
              <Badge variant="secondary" className="mt-1">Cached</Badge>
            </CardContent>
          </Card>

          <Card className="opacity-75">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cache.progress.performance_metrics.focus_score}%</div>
              <p className="text-xs text-muted-foreground">
                avg performance
              </p>
              <Badge variant="secondary" className="mt-1">Cached</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cached Sessions */}
      {cache.sessions.length > 0 && (
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Sessions (Cached)
              <Badge variant="secondary">
                {cache.lastSyncTime ? `Updated ${cache.lastSyncTime.toLocaleTimeString()}` : 'No sync time'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cache.sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Badge variant={session.session_type === 'quiz' ? 'default' : 'secondary'}>
                      {session.session_type}
                    </Badge>
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
          </CardContent>
        </Card>
      )}

      {/* No Cache Available */}
      {isStale && !cache.progress && cache.sessions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No cached Study Bee data available.<br />
              Please connect to the internet to sync your data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
