
import React from 'react';
import { Target } from "lucide-react";
import { StudyGoalCard } from './StudyGoalCard';

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

interface StudyGoalsListProps {
  goals: StudyGoal[];
  onUpdateProgress: (goalId: string, hoursStudied: number) => void;
}

export function StudyGoalsList({ goals, onUpdateProgress }: StudyGoalsListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No study goals yet. Create your first goal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <StudyGoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdateProgress={onUpdateProgress} 
        />
      ))}
    </div>
  );
}
