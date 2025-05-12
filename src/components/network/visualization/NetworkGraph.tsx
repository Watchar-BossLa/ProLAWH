
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NetworkConnection } from '@/types/network';
import * as d3 from 'd3';
import { Loader2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

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
  
  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Create a group for the graph elements
    const g = svg.append('g')
      .attr('transform', `scale(${zoom})`);
    
    // Create simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Define nodes and links
    const nodes = connections.map(connection => ({
      id: connection.id,
      name: connection.name,
      role: connection.role,
      company: connection.company,
      type: connection.connectionType,
      skills: connection.skills || [],
      industry: connection.industry || '',
      highlighted: connection.id === highlightedConnectionId
    }));
    
    // Create links between nodes based on industry and skills
    const links: {source: string, target: string, value: number}[] = [];
    connections.forEach((c1) => {
      connections.forEach((c2) => {
        if (c1.id !== c2.id) {
          // Check if they're in the same industry
          if (c1.industry && c2.industry && c1.industry === c2.industry) {
            links.push({ source: c1.id, target: c2.id, value: 2 });
          }
          
          // Check if they share skills
          if (c1.skills && c2.skills) {
            const sharedSkills = c1.skills.filter(skill => c2.skills?.includes(skill));
            if (sharedSkills.length > 0) {
              links.push({ source: c1.id, target: c2.id, value: sharedSkills.length });
            }
          }
        }
      });
    });
    
    // Create links visual elements
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', d => Math.sqrt(d.value))
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);
    
    // Create node visual elements
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g');
      
    // Add circles to nodes
    node.append('circle')
      .attr('r', 10)
      .attr('fill', (d) => {
        if (d.highlighted) return '#7c3aed';
        switch (d.type) {
          case 'mentor': return '#2563eb';
          case 'peer': return '#10b981';
          case 'colleague': return '#f59e0b';
          default: return '#6b7280';
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .on('click', (event, d) => {
        onConnectionSelect(d.id);
      });
      
    // Add text labels
    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text((d) => d.name)
      .style('font-size', '10px')
      .style('fill', '#4b5563');
    
    // Update positions on tick
    simulation
      .nodes(nodes as d3.SimulationNodeDatum[])
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);
          
        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      });
      
    // Apply the link force
    simulation.force<d3.ForceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>>('link')
      ?.links(links);
      
    // Add drag behavior
    const dragHandler = d3.drag<SVGGElement, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
      
    node.call(dragHandler);
    
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
    
    return () => {
      simulation.stop();
    };
  }, [connections, highlightedConnectionId, zoom, onConnectionSelect]);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoom(1);
  };
  
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <svg 
        ref={svgRef} 
        className="w-full h-full bg-muted/20 rounded-lg shadow-inner"
      />
      
      <div className="absolute bottom-2 left-2 z-10">
        <Badge variant="outline">
          {connections.length} connections
        </Badge>
      </div>
    </div>
  );
}
