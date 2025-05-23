
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Info } from "lucide-react";

interface CareerNode {
  id: string;
  title: string;
  level: number;
  salary: string;
  skills: string[];
  description?: string;
}

interface CareerPathFlowChartProps {
  initialCareer?: string;
}

export function CareerPathFlowChart({ initialCareer = "Junior Developer" }: CareerPathFlowChartProps) {
  // This would ideally come from API/database, but we'll use sample data for now
  const careerPaths = useMemo(() => {
    return [
      {
        id: "entry-1",
        title: "Junior Developer",
        level: 1,
        salary: "$60-80k",
        skills: ["JavaScript", "HTML/CSS", "React Basics"],
        description: "Entry level development position"
      },
      {
        id: "mid-1",
        title: "Frontend Developer",
        level: 2,
        salary: "$80-110k",
        skills: ["React", "TypeScript", "Testing", "Performance Optimization"]
      },
      {
        id: "mid-2",
        title: "Full Stack Developer",
        level: 2,
        salary: "$90-120k",
        skills: ["Node.js", "Databases", "API Design", "Cloud Services"]
      },
      {
        id: "senior-1",
        title: "Senior Frontend Developer",
        level: 3,
        salary: "$120-150k",
        skills: ["Architecture", "Team Leadership", "Advanced React Patterns"]
      },
      {
        id: "senior-2",
        title: "Senior Full Stack Developer",
        level: 3,
        salary: "$130-160k",
        skills: ["System Design", "Microservices", "DevOps", "Mentorship"]
      },
      {
        id: "lead-1",
        title: "Frontend Lead",
        level: 4,
        salary: "$150-180k",
        skills: ["Team Management", "Technical Decision Making", "Project Planning"]
      },
      {
        id: "lead-2",
        title: "Tech Lead",
        level: 4,
        salary: "$160-190k",
        skills: ["Cross-team Collaboration", "Technical Strategy", "Architecture"]
      }
    ] as CareerNode[];
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Career Progression Path</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto h-[400px]">
        <div className="min-w-[700px] relative">
          {/* Level labels */}
          <div className="flex justify-between mb-4 text-sm text-muted-foreground">
            <div>Entry Level</div>
            <div>Mid Level</div>
            <div>Senior Level</div>
            <div>Leadership</div>
          </div>
          
          {/* Level columns */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(level => (
              <div key={level} className="space-y-4">
                {careerPaths
                  .filter(career => career.level === level)
                  .map(career => (
                    <div 
                      key={career.id} 
                      className={`p-4 rounded-lg border bg-card text-card-foreground shadow ${
                        career.title === initialCareer ? 'border-primary border-2' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{career.title}</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{career.description || `${career.title} position`}</p>
                              <p className="text-sm mt-1">Typical salary: {career.salary}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="mb-2 text-sm text-muted-foreground">
                        {career.salary}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Key Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.map((skill, i) => (
                            <div key={i} className="px-2 py-1 bg-muted text-xs rounded">
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {level < 4 && (
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Details <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          
          {/* Path connectors - simplified visual representation */}
          <div className="absolute top-1/2 left-0 w-full">
            <div className="border-t-2 border-dashed border-muted-foreground/30 w-full h-0"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
