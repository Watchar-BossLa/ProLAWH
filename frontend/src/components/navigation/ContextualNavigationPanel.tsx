
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, ArrowRight, Brain } from 'lucide-react';
import { useContextualNavigation } from '@/hooks/navigation/useContextualNavigation';
import { useNavigation } from './NavigationProvider';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export function ContextualNavigationPanel() {
  const { isEnabled } = useFeatureFlags();
  const { suggestions, quickActions, workflowHints } = useContextualNavigation();
  const { navigate } = useNavigation();

  if (!isEnabled('smartNavigation')) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-blue-600" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all cursor-pointer"
                onClick={() => navigate(suggestion.path)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  <div className="text-xs text-blue-600 mt-1">{suggestion.reason}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {quickActions.slice(0, 4).map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Hints */}
      {workflowHints.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Workflow Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workflowHints.map((hint, index) => (
                <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  {hint}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
