
import { useState } from 'react';

export interface WidgetConfig {
  id: string;
  type: string;
  enabled: boolean;
  position: number;
}

export interface AvailableWidget {
  id: string;
  type: string;
  name: string;
}

export function usePersonalizedDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'quick-actions', type: 'quick-actions', enabled: true, position: 0 },
    { id: 'skill-progress', type: 'skill-progress', enabled: true, position: 1 },
    { id: 'recent-activity', type: 'recent-activity', enabled: true, position: 2 }
  ]);

  const availableWidgets: AvailableWidget[] = [
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

  const enabledWidgets = widgets
    .filter(w => w.enabled)
    .sort((a, b) => a.position - b.position);

  return {
    widgets,
    availableWidgets,
    enabledWidgets,
    handleRemoveWidget,
    handleToggleWidget
  };
}
