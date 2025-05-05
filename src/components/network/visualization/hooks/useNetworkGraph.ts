
import { useEffect, RefObject } from 'react';
import * as d3 from 'd3';
import { NetworkConnection } from '@/types/network';
import { createSimulation, generateNodesAndLinks, applyDragBehavior } from '../utils/graphSimulation';

export function useNetworkGraph(
  svgRef: RefObject<SVGSVGElement>,
  connections: NetworkConnection[],
  highlightedConnectionId: string | undefined,
  onConnectionSelect: (connectionId: string) => void,
  zoom: number = 1
) {
  // Fix: moved optional parameter 'zoom' to the end of the parameter list

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous graph and setup base SVG
    const svg = setupSvgCanvas(svgRef.current, width, height);
    const g = createScaledGroup(svg, zoom);
    
    // Create simulation
    const simulation = createSimulation(width, height);
    
    // Process data
    const connectionsWithHighlight = markHighlightedConnections(connections, highlightedConnectionId);
    const { nodes, links } = generateNodesAndLinks(connectionsWithHighlight);
    
    // Render graph elements
    const link = createLinks(g, links);
    const node = createNodes(g, nodes, onConnectionSelect);
    
    // Add legend
    createLegend(svg);
    
    // Configure simulation
    configureSimulation(simulation, nodes, links, link, node);
    
    return () => {
      simulation.stop();
    };
  }, [connections, highlightedConnectionId, zoom, svgRef, onConnectionSelect]);

  // Zoom control handlers
  const handleZoomIn = () => {
    return Math.min(zoom + 0.2, 3);
  };
  
  const handleZoomOut = () => {
    return Math.max(zoom - 0.2, 0.5);
  };
  
  const handleReset = () => {
    return 1;
  };

  return {
    handleZoomIn,
    handleZoomOut,
    handleReset
  };
}

// Helper functions for rendering and setup

function setupSvgCanvas(svgElement: SVGSVGElement, width: number, height: number) {
  // Clear previous graph
  d3.select(svgElement).selectAll('*').remove();
  
  return d3.select(svgElement)
    .attr('width', width)
    .attr('height', height);
}

function createScaledGroup(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, zoom: number) {
  return svg.append('g')
    .attr('transform', `scale(${zoom})`);
}

function markHighlightedConnections(connections: NetworkConnection[], highlightedId?: string) {
  return connections.map(conn => ({
    ...conn,
    highlighted: conn.id === highlightedId
  }));
}

function createLinks(
  g: d3.Selection<SVGGElement, unknown, null, undefined>, 
  links: any[]
) {
  return g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke-width', d => Math.sqrt(d.value))
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6);
}

function createNodes(
  g: d3.Selection<SVGGElement, unknown, null, undefined>, 
  nodes: any[],
  onConnectionSelect: (connectionId: string) => void
) {
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
        case "mentor": return '#2563eb';
        case "peer": return '#10b981';
        case "colleague": return '#f59e0b';
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
    
  return node;
}

function createLegend(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
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
}

function configureSimulation(
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>,
  nodes: any[],
  links: any[],
  link: d3.Selection<SVGLineElement, unknown, SVGGElement, unknown>,
  node: d3.Selection<SVGGElement, any, SVGGElement, unknown>
) {
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
  applyDragBehavior(node, simulation);
}
