
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertCircle } from "lucide-react";
import { ImplementationPlan } from "@/types/career";

interface ImplementationProgressTrackerProps {
  plans: ImplementationPlan[];
}

export const ImplementationProgressTracker = ({ plans }: ImplementationProgressTrackerProps) => {
  const planProgress = useMemo(() => {
    if (!plans || plans.length === 0) return [];
    
    return plans.map(plan => {
      // Calculate completion percentage
      const totalSteps = plan.steps.length;
      const completedSteps = plan.steps.filter(step => step.completed).length;
      const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      
      // Determine status icon
      let StatusIcon = Clock;
      if (plan.status === 'completed') {
        StatusIcon = Check;
      } else if (plan.status === 'abandoned') {
        StatusIcon = AlertCircle;
      }
      
      return {
        ...plan,
        percentage,
        StatusIcon
      };
    });
  }, [plans]);
  
  if (!plans || plans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Implementation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">
            No implementation plans found. Accept and implement recommendations to see progress here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Implementation Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {planProgress.map((plan) => (
          <div key={plan.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <plan.StatusIcon 
                  className={`h-4 w-4 ${
                    plan.status === 'completed' ? 'text-green-500' :
                    plan.status === 'abandoned' ? 'text-red-500' :
                    plan.status === 'in_progress' ? 'text-blue-500' : 'text-yellow-500'
                  }`} 
                />
                <span className="font-medium">{plan.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">{plan.percentage}%</span>
            </div>
            
            <Progress value={plan.percentage} className="h-2" />
            
            <div className="text-xs text-muted-foreground">
              {plan.steps.filter(step => step.completed).length} of {plan.steps.length} steps completed
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {plan.steps.map((step) => (
                <div 
                  key={`${plan.id}-step-${step.step}`}
                  className={`text-xs px-2 py-1 rounded-sm ${
                    step.completed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
