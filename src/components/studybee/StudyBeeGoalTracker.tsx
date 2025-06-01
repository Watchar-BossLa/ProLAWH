
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock,
  BookOpen,
  TrendingUp 
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

export function StudyBeeGoalTracker() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_hours: 10,
    deadline: '',
    subject: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const createGoal = async () => {
    if (!user || !newGoal.title || !newGoal.deadline) {
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

  const getProgressPercentage = (goal: StudyGoal) => {
    return Math.min((goal.current_hours / goal.target_hours) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Study Goal Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="goals" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="goals">My Goals</TabsTrigger>
              <TabsTrigger value="create">Create Goal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="goals" className="space-y-4">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No study goals yet. Create your first goal!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <Card key={goal.id} className={goal.status === 'completed' ? 'border-green-200 bg-green-50' : ''}>
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
                            <span>{Math.round(getProgressPercentage(goal))}%</span>
                          </div>
                          <Progress value={getProgressPercentage(goal)} />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Deadline: {new Date(goal.deadline).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getDaysRemaining(goal.deadline)} days remaining
                            </div>
                          </div>
                        </div>
                        
                        {goal.status === 'active' && (
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateGoalProgress(goal.id, 1)}
                            >
                              +1 Hour
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateGoalProgress(goal.id, 0.5)}
                            >
                              +30 Min
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title">Goal Title *</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Master React Fundamentals"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="goal-description">Description</Label>
                  <Input
                    id="goal-description"
                    placeholder="What do you want to achieve?"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-hours">Target Hours *</Label>
                    <Input
                      id="target-hours"
                      type="number"
                      min="1"
                      value={newGoal.target_hours}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target_hours: parseInt(e.target.value) || 10 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., React, Math, etc."
                      value={newGoal.subject}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                
                <Button 
                  onClick={createGoal} 
                  disabled={isCreating || !newGoal.title || !newGoal.deadline}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Study Goal'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
