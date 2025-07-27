
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, TrendingUp, Star, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CareerOption {
  title: string;
  demandGrowth: number;
  salary: string;
  matchPercentage: number;
  requiredSkills: string[];
  description?: string;
  difficulty?: number;
  potentialCompanies?: string[];
}

interface GreenCareerPathwayProps {
  careerOptions: CareerOption[];
}

export function GreenCareerPathway({ careerOptions }: GreenCareerPathwayProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Green Career Pathways
          </CardTitle>
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Personalized career opportunities based on your skills and market demand
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[360px]">
          <div className="space-y-4">
            {careerOptions.map((career, index) => (
              <Card key={index} className="bg-muted/40 hover:bg-muted/60 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-md">{career.title}</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {career.matchPercentage}% Match
                      </Badge>
                    </div>
                    
                    {career.description && (
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-muted-foreground">{career.demandGrowth}% Growth</span>
                      </div>
                      <div className="text-right">{career.salary}</div>
                      
                      {career.difficulty && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-muted-foreground">Transition Difficulty</span>
                        </div>
                      )}
                      
                      {career.difficulty && (
                        <div className="flex justify-end items-center gap-1">
                          <Progress value={career.difficulty * 20} className="w-20 h-2" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {career.difficulty}/5 difficulty rating <br />
                                  based on your current skills
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.requiredSkills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {career.potentialCompanies && (
                      <div className="mt-1">
                        <div className="text-xs text-muted-foreground mb-1">Potential Employers</div>
                        <div className="flex flex-wrap gap-1">
                          {career.potentialCompanies.map((company, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <span>View Skills Gap</span>
                        <AlertCircle className="h-4 w-4 ml-2" />
                      </Button>
                      <Button size="sm" className="flex-1">
                        <span>Career Path</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
