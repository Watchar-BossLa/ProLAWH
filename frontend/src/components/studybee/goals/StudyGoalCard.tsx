
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Calendar, 
  Clock,
  BookOpen 
} from "lucide-react";

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target_hours: number;
  current_hours: number;
  deadline: string;
  subject?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

interface StudyGoalCardProps {
  goal: StudyGoal;
  onUpdateProgress: (goalId: string, hoursStudied: number) => void;
}

export function StudyGoalCard({ goal, onUpdateProgress }: StudyGoalCardProps) {
  const getProgressPercentage = () => {
    return Math.min((goal.current_hours / goal.target_hours) * 100, 100);
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className={goal.status === 'completed' ? 'border-green-200 bg-green-50' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{goal.title}</h3>
              <Badge variant={
                goal.status === 'completed' ? 'default' : 
                goal.status === 'paused' ? 'secondary' : 'outline'
              }>
                {goal.status}
              </Badge>
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
            )}
            {goal.subject && (
              <Badge variant="outline" className="mb-2">
                <BookOpen className="h-3 w-3 mr-1" />
                {goal.subject}
              </Badge>
            )}
          </div>
          {goal.status === 'completed' && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {goal.current_hours}h / {goal.target_hours}h</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getDaysRemaining()} days remaining
            </div>
          </div>
        </div>
        
        {goal.status === 'active' && (
          <div className="mt-4 flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onUpdateProgress(goal.id, 1)}
            >
              +1 Hour
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onUpdateProgress(goal.id, 0.5)}
            >
              +30 Min
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
