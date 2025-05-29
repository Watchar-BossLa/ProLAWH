
import React from 'react';
import { usePersonalizedDashboard } from '@/hooks/dashboard/usePersonalizedDashboard';
import { WidgetRenderer } from './widgets/WidgetRenderer';
import { DashboardCustomization } from './widgets/DashboardCustomization';

export function PersonalizedDashboard() {
  const {
    widgets,
    availableWidgets,
    enabledWidgets,
    handleRemoveWidget,
    handleToggleWidget
  } = usePersonalizedDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <DashboardCustomization
          widgets={widgets}
          availableWidgets={availableWidgets}
          onToggleWidget={handleToggleWidget}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enabledWidgets.map(widget => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            onRemove={handleRemoveWidget}
          />
        ))}
      </div>
    </div>
  );
}
