
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  role: string;
  company: string;
  type: string;
  skills: string[];
  industry: string;
  highlighted: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export function createSimulation(width: number, height: number) {
  return d3.forceSimulation()
    .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2));
}

export function generateNodesAndLinks(connections: any[]) {
  // Define nodes and links
  const nodes = connections.map(connection => ({
    id: connection.id,
    name: connection.name,
    role: connection.role,
    company: connection.company,
    type: connection.connectionType,
    skills: connection.skills || [],
    industry: connection.industry || '',
    highlighted: connection.id === connections.find(c => c.highlighted)?.id
  }));
  
  // Create links between nodes based on industry and skills
  const links: Link[] = [];
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

  return { nodes, links };
}

export function applyDragBehavior(node: d3.Selection<SVGGElement, any, SVGGElement, unknown>, simulation: d3.Simulation<any, undefined>) {
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
}
