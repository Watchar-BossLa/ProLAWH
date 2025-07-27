
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export function BehaviorProfileHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-blue-600" />
        AI Behavior Profile
      </CardTitle>
      <CardDescription>
        Help our AI understand your work preferences for better opportunity matching
      </CardDescription>
    </CardHeader>
  );
}
