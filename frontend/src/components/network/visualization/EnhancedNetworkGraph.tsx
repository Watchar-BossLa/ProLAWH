
import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NetworkConnection } from '@/types/network';
import { Network, Filter, ZoomIn, ZoomOut, RotateCcw, Users } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface D3Node extends NetworkConnection {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  connectionCount?: number;
}

interface D3Link {
  source: string | D3Node;
  target: string | D3Node;
  value: number;
}

interface EnhancedNetworkGraphProps {
  connections: NetworkConnection[];
  onConnectionSelect: (connectionId: string) => void;
  highlightedConnectionId?: string;
}

export function EnhancedNetworkGraph({ 
  connections, 
  onConnectionSelect,
  highlightedConnectionId 
}: EnhancedNetworkGraphProps) {
  const { isEnabled } = useFeatureFlags();
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [clusterBy, setClusterBy] = useState<'skill' | 'industry' | 'type'>('skill');
  const [filterType, setFilterType] = useState<string>('all');
  const [networkMetrics, setNetworkMetrics] = useState({
    totalConnections: 0,
    avgConnectionsPerNode: 0,
    networkDensity: 0,
    clusters: 0
  });

  useEffect(() => {
    if (!svgRef.current || connections.length === 0 || !isEnabled('advancedNetworking')) return;
    
    renderEnhancedNetwork();
  }, [connections, clusterBy, filterType, zoom, highlightedConnectionId]);

  const renderEnhancedNetwork = () => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    
    // Clear previous render
    svg.selectAll('*').remove();
    
    // Filter connections based on selected filter
    const filteredConnections = filterType === 'all' 
      ? connections 
      : connections.filter(conn => conn.connectionType === filterType);

    // Create nodes and links with clustering
    const { nodes, links, clusterCenters } = createClusteredNetwork(filteredConnections);
    
    // Update metrics
    setNetworkMetrics({
      totalConnections: filteredConnections.length,
      avgConnectionsPerNode: links.length / nodes.length || 0,
      networkDensity: (2 * links.length) / (nodes.length * (nodes.length - 1)) || 0,
      clusters: Object.keys(clusterCenters).length
    });

    // Create force simulation with clustering
    const simulation = d3.forceSimulation(nodes as D3Node[])
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('cluster', forceCluster(clusterCenters));

    // Create main group with zoom behavior
    const g = svg.append('g')
      .attr('transform', `scale(${zoom})`);

    // Add cluster backgrounds
    const clusterGroups = g.selectAll('.cluster')
      .data(Object.entries(clusterCenters))
      .enter().append('g')
      .attr('class', 'cluster');

    clusterGroups.append('circle')
      .attr('r', 120)
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .attr('fill-opacity', 0.1)
      .attr('stroke', (d, i) => d3.schemeCategory10[i % 10])
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    clusterGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -100)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
      .text(d => d[0]);

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add node circles
    node.append('circle')
      .attr('r', d => d.connectionCount ? Math.sqrt(d.connectionCount) * 4 + 8 : 12)
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => d.id === highlightedConnectionId ? '#ff6b35' : '#fff')
      .attr('stroke-width', d => d.id === highlightedConnectionId ? 3 : 2);

    // Add node labels
    node.append('text')
      .attr('dx', 15)
      .attr('dy', 4)
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => d.name);

    // Add click handlers
    node.on('click', (event, d) => {
      onConnectionSelect(d.id);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x || 0)
        .attr('y1', d => (d.source as D3Node).y || 0)
        .attr('x2', d => (d.target as D3Node).x || 0)
        .attr('y2', d => (d.target as D3Node).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
      
      clusterGroups.attr('transform', d => `translate(${d[1].x},${d[1].y})`);
    });

    function dragstarted(event: any, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const createClusteredNetwork = (connections: NetworkConnection[]) => {
    const nodes: D3Node[] = connections.map(conn => ({
      ...conn,
      connectionCount: 0
    }));

    // Create clusters based on selected criteria
    const clusters: { [key: string]: D3Node[] } = {};
    nodes.forEach(node => {
      let clusterKey = '';
      switch (clusterBy) {
        case 'skill':
          clusterKey = node.skills?.[0] || 'General';
          break;
        case 'industry':
          clusterKey = node.industry || 'Other';
          break;
        case 'type':
          clusterKey = node.connectionType;
          break;
      }
      
      if (!clusters[clusterKey]) clusters[clusterKey] = [];
      clusters[clusterKey].push(node);
    });

    // Create cluster centers
    const clusterCenters: { [key: string]: { x: number; y: number } } = {};
    Object.keys(clusters).forEach((cluster, i) => {
      const angle = (i / Object.keys(clusters).length) * 2 * Math.PI;
      clusterCenters[cluster] = {
        x: 400 + Math.cos(angle) * 200,
        y: 300 + Math.sin(angle) * 200
      };
    });

    // Create links based on shared attributes
    const links: D3Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sharedSkills = (nodes[i].skills || []).filter(skill => 
          (nodes[j].skills || []).includes(skill)
        ).length;
        
        const sameIndustry = nodes[i].industry === nodes[j].industry ? 1 : 0;
        const sameType = nodes[i].connectionType === nodes[j].connectionType ? 1 : 0;
        
        const linkStrength = sharedSkills + sameIndustry + sameType;
        
        if (linkStrength > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            value: linkStrength
          });
          nodes[i].connectionCount = (nodes[i].connectionCount || 0) + 1;
          nodes[j].connectionCount = (nodes[j].connectionCount || 0) + 1;
        }
      }
    }

    return { nodes, links, clusterCenters };
  };

  const forceCluster = (clusterCenters: { [key: string]: { x: number; y: number } }) => {
    return (alpha: number) => {
      connections.forEach((node: any) => {
        let clusterKey = '';
        switch (clusterBy) {
          case 'skill':
            clusterKey = node.skills?.[0] || 'General';
            break;
          case 'industry':
            clusterKey = node.industry || 'Other';
            break;
          case 'type':
            clusterKey = node.connectionType;
            break;
        }
        
        const cluster = clusterCenters[clusterKey];
        if (cluster && node.vx !== undefined && node.vy !== undefined) {
          const k = alpha * 0.1;
          node.vx -= (node.x - cluster.x) * k;
          node.vy -= (node.y - cluster.y) * k;
        }
      });
    };
  };

  const getNodeColor = (node: D3Node) => {
    switch (node.connectionType) {
      case 'mentor': return '#3b82f6';
      case 'peer': return '#10b981';
      case 'colleague': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.3));
  const handleReset = () => setZoom(1);

  if (!isEnabled('advancedNetworking')) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" />
            Enhanced Network Visualization
            <Badge variant="secondary">Phase 3</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={clusterBy} onValueChange={(value: any) => setClusterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skill">By Skill</SelectItem>
                <SelectItem value="industry">By Industry</SelectItem>
                <SelectItem value="type">By Type</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="peer">Peers</SelectItem>
                <SelectItem value="colleague">Colleagues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Network Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{networkMetrics.totalConnections}</div>
              <div className="text-xs text-muted-foreground">Total Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{networkMetrics.clusters}</div>
              <div className="text-xs text-muted-foreground">Clusters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{networkMetrics.avgConnectionsPerNode.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Avg Links/Node</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{(networkMetrics.networkDensity * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Network Density</div>
            </div>
          </div>

          {/* Visualization */}
          <div className="relative border rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              viewBox="0 0 800 600"
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
            />
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {connections.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No connections available to visualize
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
