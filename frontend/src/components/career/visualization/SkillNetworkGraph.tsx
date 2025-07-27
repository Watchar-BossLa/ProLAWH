
import { useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillNode {
  id: string;
  group: number;
  value: number;
  name: string;
}

interface SkillLink {
  source: string;
  target: string;
  value: number;
}

export function SkillNetworkGraph() {
  const skillGapData = useSkillGapData();
  
  const { nodes, links } = useMemo(() => {
    if (!skillGapData.length) return { nodes: [], links: [] };
    
    // Transform skill data into network graph data
    const nodes: SkillNode[] = skillGapData.map((skill, index) => ({
      id: skill.subject,
      name: skill.subject,
      group: skill.marketDemand > 7 ? 1 : skill.marketDemand > 4 ? 2 : 3,
      value: skill.userLevel
    }));
    
    // Create connections between related skills
    const links: SkillLink[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Create links based on some relationship logic
        // For demonstration, connect nodes with similar market demand
        if (Math.abs(skillGapData[i].marketDemand - skillGapData[j].marketDemand) < 2) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            value: Math.min(skillGapData[i].marketDemand, skillGapData[j].marketDemand) / 2
          });
        }
      }
    }
    
    return { nodes, links };
  }, [skillGapData]);
  
  // This effect would be used for D3 visualization rendering
  // For simplicity, we'll just display the data in a structured way
  
  if (skillGapData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Skill Ecosystem</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Skill Ecosystem</span>
          <div className="flex gap-2">
            <Badge className="bg-blue-500">High Demand</Badge>
            <Badge className="bg-indigo-500">Growing</Badge>
            <Badge className="bg-purple-500">Emerging</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative flex items-center justify-center overflow-hidden border-2 border-dashed rounded-md border-muted">
          <p className="text-muted-foreground text-sm text-center max-w-md">
            Your skill network visualization shows the interconnected nature of your skills 
            and how they relate to market demands. This interactive graph lets you explore
            skill relationships and identify valuable skill combinations.
            <br/><br/>
            <span className="font-semibold text-foreground">
              {nodes.length} skills and {links.length} connections identified.
            </span>
          </p>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          {nodes.map(node => (
            <Badge 
              key={node.id} 
              variant="outline"
              className={`justify-between ${
                node.group === 1 ? "border-blue-500" : 
                node.group === 2 ? "border-indigo-500" : "border-purple-500"
              }`}
            >
              {node.name} 
              <span className="ml-1 text-xs opacity-70">({node.value}/10)</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
