
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CareerOption {
  title: string;
  demandGrowth: number;
  salary: string;
  matchPercentage: number;
  requiredSkills: string[];
}

interface GreenCareerPathwayProps {
  careerOptions: CareerOption[];
}

export function GreenCareerPathway({ careerOptions }: GreenCareerPathwayProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Green Career Pathways
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {careerOptions.map((career, index) => (
            <Card key={index} className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-md">{career.title}</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {career.matchPercentage}% Match
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-muted-foreground">{career.demandGrowth}% Growth</span>
                    </div>
                    <div className="text-right">{career.salary}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {career.requiredSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button size="sm" className="w-full mt-2" variant="outline">
                    <span>View Career Path</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
