
import { FC } from 'react';
import * as d3 from 'd3';

interface NetworkGraphLegendProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

export const NetworkGraphLegend: FC<NetworkGraphLegendProps> = ({ svgRef }) => {
  if (!svgRef.current) return null;

  const svg = d3.select(svgRef.current);
  
  // Add legend
  const legend = svg.append('g')
    .attr('transform', 'translate(10, 20)');
    
  const types = [
    { type: 'mentor', color: '#2563eb', label: 'Mentor' },
    { type: 'peer', color: '#10b981', label: 'Peer' },
    { type: 'colleague', color: '#f59e0b', label: 'Colleague' }
  ];
  
  types.forEach((item, index) => {
    const legendRow = legend.append('g')
      .attr('transform', `translate(0, ${index * 20})`);
      
    legendRow.append('circle')
      .attr('r', 6)
      .attr('fill', item.color);
      
    legendRow.append('text')
      .attr('x', 15)
      .attr('y', 4)
      .text(item.label)
      .style('font-size', '10px');
  });
  
  return null;
};

export default NetworkGraphLegend;
