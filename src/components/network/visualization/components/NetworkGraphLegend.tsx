
import React from 'react';

interface LegendItem {
  type: string;
  color: string;
  label: string;
}

interface NetworkGraphLegendProps {
  items?: LegendItem[];
}

export const NetworkGraphLegend: React.FC<NetworkGraphLegendProps> = ({ 
  items = [
    { type: 'mentor', color: '#2563eb', label: 'Mentor' },
    { type: 'peer', color: '#10b981', label: 'Peer' },
    { type: 'colleague', color: '#f59e0b', label: 'Colleague' }
  ] 
}) => {
  return (
    <g transform="translate(10, 20)">
      {items.map((item, index) => (
        <g key={item.type} transform={`translate(0, ${index * 20})`}>
          <circle r={6} fill={item.color} />
          <text x={15} y={4} style={{ fontSize: '10px' }}>
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
};

export default NetworkGraphLegend;
