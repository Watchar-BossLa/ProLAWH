
import React from 'react';
import { DashboardWidget } from './DashboardWidget';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target } from "lucide-react";

interface SkillProgress {
  skill: string;
  current: number;
  target: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
}

interface SkillProgressWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function SkillProgressWidget({ id, onRemove, onConfigure }: SkillProgressWidgetProps) {
  // Mock data - in real app this would come from props or hooks
  const skillProgress: SkillProgress[] = [
    { skill: 'React', current: 7, target: 9, progress: 78, trend: 'up' },
    { skill: 'TypeScript', current: 6, target: 8, progress: 75, trend: 'up' },
    { skill: 'Node.js', current: 5, target: 7, progress: 71, trend: 'stable' },
    { skill: 'GraphQL', current: 4, target: 8, progress: 50, trend: 'up' }
  ];

  return (
    <DashboardWidget
      id={id}
      title="Skill Progress"
      description="Track your learning journey"
      onRemove={onRemove}
      onConfigure={onConfigure}
      size="medium"
    >
      <div className="space-y-4">
        {skillProgress.map((skill) => (
          <div key={skill.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{skill.skill}</span>
                <Badge variant="outline" className="text-xs">
                  {skill.current}/{skill.target}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {skill.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {skill.trend === 'down' && <Target className="h-3 w-3 text-red-500" />}
                <span className="text-xs text-muted-foreground">{skill.progress}%</span>
              </div>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
