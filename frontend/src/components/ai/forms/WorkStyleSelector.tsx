
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const workStyles = ['Independent', 'Collaborative', 'Leadership', 'Supportive', 'Analytical', 'Creative'];

interface WorkStyleSelectorProps {
  selectedWorkStyles: string[];
  onToggle: (style: string) => void;
}

export function WorkStyleSelector({ selectedWorkStyles, onToggle }: WorkStyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <Label className="text-base font-semibold">Work Style Preferences</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        {workStyles.map(style => (
          <Badge
            key={style}
            variant={selectedWorkStyles.includes(style) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggle(style)}
          >
            {style}
          </Badge>
        ))}
      </div>
    </div>
  );
}
