
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface NetworkGraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const NetworkGraphControls: React.FC<NetworkGraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset
}) => {
  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10">
      <Button variant="outline" size="icon" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onReset}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NetworkGraphControls;
