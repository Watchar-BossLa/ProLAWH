import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Info, Atom, Code, BarChart, Layers, Users, Heart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSkillGapData } from "@/hooks/useSkillGapData";

interface CareerNode {
  id: string;
  title: string;
  level: number;
  salary: string;
  skills: string[];
  description?: string;
  icon: JSX.Element;
}

interface PathOption {
  id: string;
  name: string;
  description: string;
  levels: number[]; // Which levels this path spans
  color: string;
}

interface CareerPathFlowChartProps {
  initialCareer?: string;
}

export function CareerPathFlowChart({ initialCareer = "Junior Developer" }: CareerPathFlowChartProps) {
  const skillGapData = useSkillGapData();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [focusNode, setFocusNode] = useState<string | null>(null);
  
  // This would ideally come from API/database, but we'll use sample data for now
  const careerPaths = useMemo(() => {
    return [
      {
        id: "entry-1",
        title: "Junior Developer",
        level: 1,
        salary: "$60-80k",
        skills: ["JavaScript", "HTML/CSS", "React Basics"],
        description: "Entry level development position",
        icon: <Code className="h-4 w-4 text-blue-500" />
      },
      {
        id: "mid-1",
        title: "Frontend Developer",
        level: 2,
        salary: "$80-110k",
        skills: ["React", "TypeScript", "Testing", "Performance Optimization"],
        icon: <Layers className="h-4 w-4 text-indigo-500" />
      },
      {
        id: "mid-2",
        title: "Full Stack Developer",
        level: 2,
        salary: "$90-120k",
        skills: ["Node.js", "Databases", "API Design", "Cloud Services"],
        icon: <Code className="h-4 w-4 text-purple-500" />
      },
      {
        id: "senior-1",
        title: "Senior Frontend Developer",
        level: 3,
        salary: "$120-150k",
        skills: ["Architecture", "Team Leadership", "Advanced React Patterns"],
        icon: <Layers className="h-4 w-4 text-indigo-600" />
      },
      {
        id: "senior-2",
        title: "Senior Full Stack Developer",
        level: 3,
        salary: "$130-160k",
        skills: ["System Design", "Microservices", "DevOps", "Mentorship"],
        icon: <Code className="h-4 w-4 text-purple-600" />
      },
      {
        id: "lead-1",
        title: "Frontend Lead",
        level: 4,
        salary: "$150-180k",
        skills: ["Team Management", "Technical Decision Making", "Project Planning"],
        icon: <Users className="h-4 w-4 text-indigo-700" />
      },
      {
        id: "lead-2",
        title: "Tech Lead",
        level: 4,
        salary: "$160-190k",
        skills: ["Cross-team Collaboration", "Technical Strategy", "Architecture"],
        icon: <Users className="h-4 w-4 text-purple-700" />
      },
      {
        id: "data-1",
        title: "Data Analyst",
        level: 1,
        salary: "$65-85k",
        skills: ["SQL", "Excel", "Data Visualization", "Statistics Basics"],
        icon: <BarChart className="h-4 w-4 text-green-500" />
      },
      {
        id: "data-2",
        title: "Data Scientist",
        level: 2,
        salary: "$90-120k",
        skills: ["Python", "Machine Learning", "Statistical Analysis", "Data Engineering"],
        icon: <BarChart className="h-4 w-4 text-green-600" />
      },
      {
        id: "data-3",
        title: "ML Engineer",
        level: 3,
        salary: "$120-160k",
        skills: ["Deep Learning", "MLOps", "Model Deployment", "Cloud ML Services"],
        icon: <Atom className="h-4 w-4 text-green-700" />
      },
      {
        id: "data-4",
        title: "AI Architect",
        level: 4,
        salary: "$160-200k",
        skills: ["AI Strategy", "Research Leadership", "Business Integration"],
        icon: <Atom className="h-4 w-4 text-green-800" />
      },
      {
        id: "design-1",
        title: "UI Designer",
        level: 1,
        salary: "$55-75k",
        skills: ["Visual Design", "UI Patterns", "Design Tools", "Typography"],
        icon: <Heart className="h-4 w-4 text-red-500" />
      },
      {
        id: "design-2",
        title: "UX/UI Designer",
        level: 2,
        salary: "$75-100k",
        skills: ["Wireframing", "User Research", "Usability Testing", "Interactive Prototypes"],
        icon: <Heart className="h-4 w-4 text-red-600" />
      },
      {
        id: "design-3",
        title: "Senior Product Designer",
        level: 3,
        salary: "$100-140k",
        skills: ["Design Systems", "User-Centered Design Process", "Team Leadership"],
        icon: <Heart className="h-4 w-4 text-red-700" />
      },
      {
        id: "design-4",
        title: "Design Director",
        level: 4,
        salary: "$140-180k",
        skills: ["Design Strategy", "Cross-functional Leadership", "Product Vision"],
        icon: <Heart className="h-4 w-4 text-red-800" />
      }
    ] as CareerNode[];
  }, []);

  const pathOptions = useMemo(() => [
    {
      id: "frontend",
      name: "Frontend Development",
      description: "Specialize in building user interfaces and experiences",
      levels: [1, 2, 3, 4],
      color: "border-indigo-500"
    },
    {
      id: "fullstack",
      name: "Full Stack Development",
      description: "Master both frontend and backend technologies",
      levels: [1, 2, 3, 4],
      color: "border-purple-500"
    },
    {
      id: "data",
      name: "Data & AI",
      description: "Focus on data analysis, machine learning and AI systems",
      levels: [1, 2, 3, 4],
      color: "border-green-500"
    },
    {
      id: "design",
      name: "Design & UX",
      description: "Create beautiful and functional user experiences",
      levels: [1, 2, 3, 4],
      color: "border-red-500"
    }
  ], []);
  
  // Filter careers based on selected path
  const filteredCareers = useMemo(() => {
    if (!selectedPath) return careerPaths;
    
    const pathInfo = pathOptions.find(p => p.id === selectedPath);
    if (!pathInfo) return careerPaths;
    
    // Logic to filter careers based on path id
    switch (selectedPath) {
      case 'frontend':
        return careerPaths.filter(career => 
          ['entry-1', 'mid-1', 'senior-1', 'lead-1'].includes(career.id)
        );
      case 'fullstack':
        return careerPaths.filter(career => 
          ['entry-1', 'mid-2', 'senior-2', 'lead-2'].includes(career.id)
        );
      case 'data':
        return careerPaths.filter(career => 
          ['data-1', 'data-2', 'data-3', 'data-4'].includes(career.id)
        );
      case 'design':
        return careerPaths.filter(career => 
          ['design-1', 'design-2', 'design-3', 'design-4'].includes(career.id)
        );
      default:
        return careerPaths;
    }
  }, [careerPaths, selectedPath, pathOptions]);
  
  // Calculate match score based on user's skills
  const getMatchScore = (career: CareerNode) => {
    if (!skillGapData.length) return 50; // Default match score
    
    let matchScore = 50;
    let relevantSkillCount = 0;
    
    career.skills.forEach(skill => {
      const skillData = skillGapData.find(s => s.subject.toLowerCase() === skill.toLowerCase());
      if (skillData) {
        matchScore += skillData.userLevel * 5;
        relevantSkillCount++;
      }
    });
    
    // If we have relevant skill data, calculate average, otherwise keep default
    return relevantSkillCount > 0 
      ? Math.min(100, Math.round(matchScore / relevantSkillCount)) 
      : 50;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Career Progression Path</CardTitle>
            <CardDescription>Explore potential career trajectories and pathways</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={!selectedPath ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => setSelectedPath(null)}
            >
              All Paths
            </Button>
            
            {pathOptions.map(path => (
              <Button
                key={path.id}
                variant={selectedPath === path.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedPath(path.id)}
                className={cn("border-l-4", selectedPath === path.id ? "border-l-primary" : path.color)}
              >
                {path.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto pb-2">
        <div className="min-w-[700px] relative">
          {/* Level labels */}
          <div className="flex justify-between mb-4 text-sm text-muted-foreground">
            <div>Entry Level</div>
            <div>Mid Level</div>
            <div>Senior Level</div>
            <div>Leadership</div>
          </div>
          
          {/* Level columns */}
          <div className="grid grid-cols-4 gap-4 pb-4">
            {[1, 2, 3, 4].map(level => (
              <div key={level} className="space-y-4">
                {filteredCareers
                  .filter(career => career.level === level)
                  .map(career => {
                    const matchScore = getMatchScore(career);
                    const isHighlighted = focusNode === career.id;
                    
                    return (
                      <div 
                        key={career.id} 
                        className={cn(
                          "p-4 rounded-lg border bg-card text-card-foreground shadow transition-all",
                          career.title === initialCareer && "border-primary border-2",
                          isHighlighted && "ring-2 ring-primary ring-offset-2",
                          {
                            "border-l-4 border-l-indigo-500": career.id.includes('mid-1') || career.id.includes('senior-1') || career.id.includes('lead-1'),
                            "border-l-4 border-l-purple-500": career.id.includes('mid-2') || career.id.includes('senior-2') || career.id.includes('lead-2'),
                            "border-l-4 border-l-green-500": career.id.includes('data-'),
                            "border-l-4 border-l-red-500": career.id.includes('design-'),
                          }
                        )}
                        onMouseEnter={() => setFocusNode(career.id)}
                        onMouseLeave={() => setFocusNode(null)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {career.icon}
                            <h3 className="font-medium">{career.title}</h3>
                          </div>
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
                        
                        <div className="mb-2 text-sm text-muted-foreground flex items-center justify-between">
                          <span>{career.salary}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Match:</span>
                            <Badge 
                              className={cn(
                                "text-xs",
                                matchScore >= 80 ? "bg-green-500" : 
                                matchScore >= 60 ? "bg-amber-500" : "bg-red-500"
                              )}
                            >
                              {matchScore}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">Key Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {career.skills.map((skill, i) => {
                              // Check if this skill exists in user's skill data
                              const userSkill = skillGapData.find(s => s.subject.toLowerCase() === skill.toLowerCase());
                              const hasSkill = userSkill && userSkill.userLevel > 5;
                              
                              return (
                                <div 
                                  key={i} 
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-1 text-xs rounded",
                                    hasSkill 
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                                      : "bg-muted"
                                  )}
                                >
                                  {hasSkill && <CheckCircle2 className="h-3 w-3" />}
                                  {skill}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {level < 4 && (
                          <div className="mt-3 flex justify-end">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Explore <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            ))}
          </div>
          
          {/* Career path visualization */}
          {selectedPath && (
            <div className="absolute top-1/2 left-0 w-full pointer-events-none">
              <div 
                className={cn(
                  "border-t-2 border-dashed w-full h-0",
                  selectedPath === 'frontend' ? "border-indigo-500" :
                  selectedPath === 'fullstack' ? "border-purple-500" :
                  selectedPath === 'data' ? "border-green-500" :
                  "border-red-500"
                )}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
