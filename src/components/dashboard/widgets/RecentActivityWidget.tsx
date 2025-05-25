
import React from 'react';
import { DashboardWidget } from './DashboardWidget';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, Award } from "lucide-react";

interface Activity {
  id: string;
  type: 'course' | 'mentorship' | 'badge' | 'assessment';
  title: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'upcoming';
}

interface RecentActivityWidgetProps {
  id: string;
  onRemove?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export function RecentActivityWidget({ id, onRemove, onConfigure }: RecentActivityWidgetProps) {
  // Mock data - in real app this would come from props or hooks
  const activities: Activity[] = [
    {
      id: '1',
      type: 'course',
      title: 'Advanced React Patterns',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'mentorship',
      title: 'Career Planning Session',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'badge',
      title: 'JavaScript Expert Badge',
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'assessment',
      title: 'TypeScript Assessment',
      timestamp: '3 days ago',
      status: 'in_progress'
    }
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'mentorship': return Users;
      case 'badge': return Award;
      case 'assessment': return Clock;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'upcoming': return 'bg-orange-500';
    }
  };

  return (
    <DashboardWidget
      id={id}
      title="Recent Activity"
      description="Your latest learning activities"
      onRemove={onRemove}
      onConfigure={onConfigure}
      size="medium"
    >
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={getStatusColor(activity.status)}>
                  <Icon className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              <Badge
                variant={activity.status === 'completed' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {activity.status.replace('_', ' ')}
              </Badge>
            </div>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
