
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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

interface StudyGoalFormData {
  title: string;
  description: string;
  target_hours: number;
  deadline: string;
  subject: string;
}

export function useStudyGoals() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newGoal, setNewGoal] = useState<StudyGoalFormData>({
    title: '',
    description: '',
    target_hours: 10,
    deadline: '',
    subject: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const createGoal = async (userId?: string) => {
    if (!userId || !newGoal.title || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const goal: StudyGoal = {
        id: crypto.randomUUID(),
        title: newGoal.title,
        description: newGoal.description,
        target_hours: newGoal.target_hours,
        current_hours: 0,
        deadline: newGoal.deadline,
        subject: newGoal.subject,
        status: 'active',
        created_at: new Date().toISOString()
      };

      // Store in local state (in real app, this would sync to database)
      setGoals(prev => [...prev, goal]);

      // Send to Study Bee for integration
      const studyBeeWindow = window.open('', 'studybee');
      if (studyBeeWindow) {
        studyBeeWindow.postMessage({
          type: 'create_goal',
          data: goal
        }, 'https://www.studybee.info');
      }

      toast({
        title: "Goal Created!",
        description: `Your study goal "${goal.title}" has been created and synced with Study Bee.`
      });

      // Reset form
      setNewGoal({
        title: '',
        description: '',
        target_hours: 10,
        deadline: '',
        subject: ''
      });

    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create study goal",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateGoalProgress = (goalId: string, hoursStudied: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrentHours = Math.min(goal.current_hours + hoursStudied, goal.target_hours);
        const updatedGoal = { 
          ...goal, 
          current_hours: newCurrentHours,
          status: newCurrentHours >= goal.target_hours ? 'completed' as const : goal.status
        };
        
        if (updatedGoal.status === 'completed' && goal.status !== 'completed') {
          toast({
            title: "🎉 Goal Completed!",
            description: `Congratulations! You've completed "${goal.title}"`,
          });
        }
        
        return updatedGoal;
      }
      return goal;
    }));
  };

  return {
    goals,
    newGoal,
    setNewGoal,
    isCreating,
    createGoal,
    updateGoalProgress
  };
}
