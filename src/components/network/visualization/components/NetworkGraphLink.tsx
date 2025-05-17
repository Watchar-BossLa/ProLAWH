
import React from 'react';

interface NetworkGraphLinkProps {
  link: {
    source: { x: number; y: number };
    target: { x: number; y: number };
    value: number;
  };
}

export const NetworkGraphLink: React.FC<NetworkGraphLinkProps> = ({ link }) => {
  return (
    <line
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
      strokeWidth={Math.sqrt(link.value)}
      stroke="#999"
      strokeOpacity={0.6}
    />
  );
};

export default NetworkGraphLink;
