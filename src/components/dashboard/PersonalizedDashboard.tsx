
import React, { useState } from 'react';
import { DashboardWidget } from './widgets/DashboardWidget';
import { SkillProgressWidget } from './widgets/SkillProgressWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { RecentActivityWidget } from './widgets/RecentActivityWidget';
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface WidgetConfig {
  id: string;
  type: string;
  enabled: boolean;
  position: number;
}

export function PersonalizedDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'quick-actions', type: 'quick-actions', enabled: true, position: 0 },
    { id: 'skill-progress', type: 'skill-progress', enabled: true, position: 1 },
    { id: 'recent-activity', type: 'recent-activity', enabled: true, position: 2 }
  ]);

  const availableWidgets = [
    { id: 'quick-actions', type: 'quick-actions', name: 'Quick Actions' },
    { id: 'skill-progress', type: 'skill-progress', name: 'Skill Progress' },
    { id: 'recent-activity', type: 'recent-activity', name: 'Recent Activity' },
    { id: 'career-insights', type: 'career-insights', name: 'Career Insights' },
    { id: 'upcoming-events', type: 'upcoming-events', name: 'Upcoming Events' }
  ];

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled: false } : w
    ));
  };

  const handleToggleWidget = (widgetId: string, enabled: boolean) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled } : w
    ));
  };

  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.enabled) return null;

    switch (widget.type) {
      case 'quick-actions':
        return (
          <QuickActionsWidget
            key={widget.id}
            id={widget.id}
            onRemove={handleRemoveWidget}
          />
        );
      case 'skill-progress':
        return (
          <SkillProgressWidget
            key={widget.id}
            id={widget.id}
            onRemove={handleRemoveWidget}
          />
        );
      case 'recent-activity':
        return (
          <RecentActivityWidget
            key={widget.id}
            id={widget.id}
            onRemove={handleRemoveWidget}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose which widgets to display on your dashboard
              </p>
              {availableWidgets.map((widget) => {
                const isEnabled = widgets.find(w => w.id === widget.id)?.enabled ?? false;
                return (
                  <div key={widget.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={widget.id}
                      checked={isEnabled}
                      onCheckedChange={(checked) => 
                        handleToggleWidget(widget.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={widget.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {widget.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter(w => w.enabled)
          .sort((a, b) => a.position - b.position)
          .map(renderWidget)
        }
      </div>
    </div>
  );
}
