
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StudyGoalFormData {
  title: string;
  description: string;
  target_hours: number;
  deadline: string;
  subject: string;
}

interface StudyGoalFormProps {
  newGoal: StudyGoalFormData;
  setNewGoal: React.Dispatch<React.SetStateAction<StudyGoalFormData>>;
  onSubmit: () => void;
  isCreating: boolean;
}

export function StudyGoalForm({ newGoal, setNewGoal, onSubmit, isCreating }: StudyGoalFormProps) {
  return (
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
        onClick={onSubmit} 
        disabled={isCreating || !newGoal.title || !newGoal.deadline}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {isCreating ? 'Creating...' : 'Create Study Goal'}
      </Button>
    </div>
  );
}
