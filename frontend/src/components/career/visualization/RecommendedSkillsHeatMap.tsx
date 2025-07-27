
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillItem {
  name: string;
  demandScore: number;
  alignmentScore: number;
  category: string;
  description?: string;
}

export function RecommendedSkillsHeatMap() {
  // This would come from API in a real application
  const recommendedSkills = useMemo<SkillItem[]>(() => [
    { 
      name: "Rust Programming", 
      demandScore: 95, 
      alignmentScore: 87, 
      category: "Programming",
      description: "Systems programming language focused on safety and performance"
    },
    { 
      name: "Environmental Data Analysis", 
      demandScore: 89, 
      alignmentScore: 92, 
      category: "Data Science",
      description: "Techniques for analyzing environmental impact data"
    },
    { 
      name: "Carbon Footprint Tracking", 
      demandScore: 86, 
      alignmentScore: 94, 
      category: "Sustainability",
      description: "Methods for measuring and optimizing carbon emissions"
    },
    { 
      name: "Green Infrastructure Design", 
      demandScore: 82, 
      alignmentScore: 90, 
      category: "Engineering",
      description: "Design principles for sustainable infrastructure"
    },
    { 
      name: "Renewable Energy Systems", 
      demandScore: 93, 
      alignmentScore: 85, 
      category: "Energy",
      description: "Understanding of solar, wind, and other renewable technologies"
    },
    { 
      name: "D3.js Data Visualization", 
      demandScore: 78, 
      alignmentScore: 88, 
      category: "Frontend",
      description: "Creating interactive data visualizations for environmental data"
    },
    { 
      name: "ESG Reporting", 
      demandScore: 90, 
      alignmentScore: 80, 
      category: "Business",
      description: "Environmental, Social and Governance business reporting standards"
    },
    { 
      name: "Cloud Carbon Optimization", 
      demandScore: 85, 
      alignmentScore: 82, 
      category: "Cloud Computing",
      description: "Techniques to reduce carbon footprint of cloud infrastructure"
    }
  ], []);

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    return recommendedSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, SkillItem[]>);
  }, [recommendedSkills]);

  const getHeatMapColor = (score: number) => {
    if (score >= 90) return "bg-green-500/80";
    if (score >= 80) return "bg-emerald-500/70";
    if (score >= 70) return "bg-teal-500/60";
    if (score >= 60) return "bg-blue-500/60";
    return "bg-blue-500/40";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommended Skills</CardTitle>
        <CardDescription>
          Top skills to develop based on market demand and profile alignment
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto h-[400px]">
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium">{category}</h3>
              <div className="grid grid-cols-1 gap-2">
                {skills.map((skill, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{skill.name}</h4>
                            <div className="flex items-center space-x-1">
                              <div 
                                className={`h-8 w-8 flex items-center justify-center rounded-md text-white text-xs font-medium ${getHeatMapColor(skill.demandScore)}`}
                              >
                                {skill.demandScore}
                              </div>
                              <div 
                                className={`h-8 w-8 flex items-center justify-center rounded-md text-white text-xs font-medium ${getHeatMapColor(skill.alignmentScore)}`}
                              >
                                {skill.alignmentScore}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="w-64 p-0">
                        <div className="p-3">
                          <p className="font-medium">{skill.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                            <div>
                              <p className="text-muted-foreground">Market Demand</p>
                              <p className="font-medium">{skill.demandScore}/100</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Profile Alignment</p>
                              <p className="font-medium">{skill.alignmentScore}/100</p>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
