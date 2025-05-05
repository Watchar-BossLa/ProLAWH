
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ConnectionsCounterProps {
  count: number;
}

export const ConnectionsCounter: React.FC<ConnectionsCounterProps> = ({ count }) => {
  return (
    <div className="absolute bottom-2 left-2 z-10">
      <Badge variant="outline">
        {count} connections
      </Badge>
    </div>
  );
};

export default ConnectionsCounter;
