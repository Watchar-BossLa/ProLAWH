
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useStudyGoals } from '@/hooks/studybee/useStudyGoals';
import { StudyGoalForm } from './goals/StudyGoalForm';
import { StudyGoalsList } from './goals/StudyGoalsList';
import { Target } from "lucide-react";

export function StudyBeeGoalTracker() {
  const { user } = useAuth();
  const {
    goals,
    newGoal,
    setNewGoal,
    isCreating,
    createGoal,
    updateGoalProgress
  } = useStudyGoals();

  const handleCreateGoal = () => {
    createGoal(user?.id);
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
              <StudyGoalsList 
                goals={goals} 
                onUpdateProgress={updateGoalProgress} 
              />
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <StudyGoalForm
                newGoal={newGoal}
                setNewGoal={setNewGoal}
                onSubmit={handleCreateGoal}
                isCreating={isCreating}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
