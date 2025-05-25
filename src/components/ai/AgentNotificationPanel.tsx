
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgenticAssistant } from "@/hooks/useAgenticAssistant";
import { 
  Brain, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Users,
  Target
} from "lucide-react";

export function AgentNotificationPanel() {
  const { actions, processUserFeedback } = useAgenticAssistant();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'skill_recommendation':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'opportunity_alert':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'network_introduction':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'learning_path_adjustment':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 4) return "destructive";
    if (urgency >= 3) return "default";
    return "secondary";
  };

  const pendingActions = actions.filter(action => action.status === 'pending');

  if (pendingActions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            AI Assistant Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Your AI assistant is monitoring your progress. New suggestions will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          AI Assistant Notifications
          <Badge variant="secondary">{pendingActions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {pendingActions.map((action) => (
              <Card key={action.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActionIcon(action.action_type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">
                          {action.action_data.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge 
                            variant={getUrgencyColor(action.urgency_level)}
                            className="text-xs"
                          >
                            {action.urgency_level === 5 ? 'Urgent' : 
                             action.urgency_level === 4 ? 'High' :
                             action.urgency_level === 3 ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {action.action_data.message}
                      </p>

                      {action.action_data.action_items && action.action_data.action_items.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Quick Actions:</p>
                          <ul className="space-y-1">
                            {action.action_data.action_items.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="text-xs flex items-center gap-1">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="text-xs px-3 py-1 h-7"
                          onClick={() => processUserFeedback(action.id, 'positive')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Act on This
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs px-3 py-1 h-7"
                          onClick={() => processUserFeedback(action.id, 'negative')}
                        >
                          Dismiss
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <Clock className="h-3 w-3" />
                        <span>Confidence: {(action.confidence_score * 100).toFixed(0)}%</span>
                        {action.action_data.deadline && (
                          <>
                            <span>•</span>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Due: {new Date(action.action_data.deadline).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
