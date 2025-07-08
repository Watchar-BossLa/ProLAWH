
import React from 'react';
import { WidgetConfig } from '@/hooks/dashboard/usePersonalizedDashboard';
import { QuickActionsWidget } from './QuickActionsWidget';
import { SkillProgressWidget } from './SkillProgressWidget';
import { RecentActivityWidget } from './RecentActivityWidget';
import { IntelligentRecommendations } from '@/components/ai/IntelligentRecommendations';

interface WidgetRendererProps {
  widget: WidgetConfig;
  onRemove: (widgetId: string) => void;
}

export function WidgetRenderer({ widget, onRemove }: WidgetRendererProps) {
  if (!widget.enabled) return null;

  switch (widget.type) {
    case 'quick-actions':
      return (
        <QuickActionsWidget
          key={widget.id}
          id={widget.id}
          onRemove={onRemove}
        />
      );
    case 'skill-progress':
      return (
        <SkillProgressWidget
          key={widget.id}
          id={widget.id}
          onRemove={onRemove}
        />
      );
    case 'recent-activity':
      return (
        <RecentActivityWidget
          key={widget.id}
          id={widget.id}
          onRemove={onRemove}
        />
      );
    case 'ai-recommendations':
      return (
        <IntelligentRecommendations
          key={widget.id}
        />
      );
    default:
      return null;
  }
}
