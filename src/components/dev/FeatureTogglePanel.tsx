
import React from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

export function FeatureTogglePanel() {
  const { flags, updateFlag } = useFeatureFlags();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Feature Toggles (Dev)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(flags).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key} className="text-xs">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </Label>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={(checked) => updateFlag(key as keyof typeof flags, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
