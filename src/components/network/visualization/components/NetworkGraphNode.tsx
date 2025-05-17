
import React from 'react';
import * as d3 from 'd3';

interface NetworkGraphNodeProps {
  data: {
    id: string;
    name: string;
    type: string;
    highlighted: boolean;
  };
  onSelect: (id: string) => void;
}

export const NetworkGraphNode: React.FC<NetworkGraphNodeProps> = ({ data, onSelect }) => {
  const getNodeColor = (type: string, highlighted: boolean): string => {
    if (highlighted) return '#7c3aed';
    
    switch (type) {
      case "mentor": return '#2563eb';
      case "peer": return '#10b981';
      case "colleague": return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleNodeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(data.id);
  };

  return (
    <g onClick={handleNodeClick}>
      <circle
        r={10}
        fill={getNodeColor(data.type, data.highlighted)}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <text
        dx={12}
        dy=".35em"
        style={{ fontSize: '10px', fill: '#4b5563' }}
      >
        {data.name}
      </text>
    </g>
  );
};

export default NetworkGraphNode;
