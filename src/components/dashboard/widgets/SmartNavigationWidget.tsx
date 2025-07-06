
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Clock, Eye } from 'lucide-react';
import { useSmartBreadcrumbs } from '@/hooks/navigation/useSmartBreadcrumbs';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { ContextualNavigationPanel } from '@/components/navigation/ContextualNavigationPanel';

export function SmartNavigationWidget() {
  const { isEnabled } = useFeatureFlags();
  const { journeyInsights } = useSmartBreadcrumbs();

  if (!isEnabled('smartNavigation')) {
    return null;
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Navigation Insights
            <Badge variant="secondary" className="ml-auto">
              Smart Navigation
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="text-2xl font-bold text-blue-600">{journeyInsights.totalPages}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Eye className="h-3 w-3" />
                Pages Visited
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="text-2xl font-bold text-green-600">
                {journeyInsights.mostVisited.length}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Frequent Pages
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(journeyInsights.averageTimePerPage)}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Avg. Time/Page
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <div className="text-2xl font-bold text-orange-600">AI</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Brain className="h-3 w-3" />
                Smart Mode
              </div>
            </div>
          </div>

          {/* Most Visited Pages */}
          {journeyInsights.mostVisited.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Your Navigation Patterns</h4>
              <div className="space-y-2">
                {journeyInsights.mostVisited.slice(0, 3).map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {page.path.split('/').pop()?.replace('-', ' ').toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {page.visitCount} visits • {formatTime(page.timeSpent)} total
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(page.confidence)}% familiarity
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contextual Navigation Panel */}
      <ContextualNavigationPanel />
    </div>
  );
}
