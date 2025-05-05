
import { useEffect, useRef, useState } from 'react';
import { NetworkConnection } from '@/types/network';
import * as d3 from 'd3';
import NetworkGraphControls from './components/NetworkGraphControls';
import ConnectionsCounter from './components/ConnectionsCounter';
import LoadingOverlay from './components/LoadingOverlay';
import { useNetworkGraph } from './hooks/useNetworkGraph';

interface NetworkGraphProps {
  connections: NetworkConnection[];
  highlightedConnectionId?: string;
  onConnectionSelect: (connectionId: string) => void;
  isLoading?: boolean;
}

export function NetworkGraph({ 
  connections, 
  highlightedConnectionId,
  onConnectionSelect,
  isLoading = false 
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  
  const { handleZoomIn, handleZoomOut, handleReset } = useNetworkGraph(
    svgRef,
    connections,
    highlightedConnectionId,
    zoom,
    onConnectionSelect
  );
  
  const onZoomIn = () => {
    setZoom(handleZoomIn());
  };
  
  const onZoomOut = () => {
    setZoom(handleZoomOut());
  };
  
  const onReset = () => {
    setZoom(handleReset());
  };
  
  return (
    <div className="relative w-full h-full min-h-[400px]">
      <LoadingOverlay isLoading={isLoading} />
      
      <NetworkGraphControls 
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onReset}
      />
      
      <svg 
        ref={svgRef} 
        className="w-full h-full bg-muted/20 rounded-lg shadow-inner"
      />
      
      <ConnectionsCounter count={connections.length} />
    </div>
  );
}
