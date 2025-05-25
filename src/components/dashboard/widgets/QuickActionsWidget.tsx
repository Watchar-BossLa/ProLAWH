
import React from 'react';
import { DashboardWidget } from './DashboardWidget';
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Briefcase, Award, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface QuickActionsWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function QuickActionsWidget({ id, onRemove, onConfigure }: QuickActionsWidgetProps) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: BookOpen,
      label: 'Start Learning',
      action: () => navigate('/dashboard/learning'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Users,
      label: 'Find Mentor',
      action: () => navigate('/dashboard/mentorship'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Briefcase,
      label: 'Browse Jobs',
      action: () => navigate('/dashboard/marketplace'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Award,
      label: 'Take Assessment',
      action: () => navigate('/dashboard/skills'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <DashboardWidget
      id={id}
      title="Quick Actions"
      description="Jump into your learning journey"
      onRemove={onRemove}
      onConfigure={onConfigure}
      size="small"
    >
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className={`h-auto p-3 flex flex-col gap-2 ${action.color} text-white hover:text-white`}
            onClick={action.action}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </DashboardWidget>
  );
}
