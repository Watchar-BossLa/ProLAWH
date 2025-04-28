
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GreenProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  teamSize: number;
  duration: string;
  category: string;
  impactArea: string;
}

interface GreenProjectsMarketplaceProps {
  projects: GreenProject[];
}

export function GreenProjectsMarketplace({ projects }: GreenProjectsMarketplaceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Sustainability Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{project.title}</h3>
                  <Badge variant={
                    project.impactArea === "Climate" ? "default" :
                    project.impactArea === "Conservation" ? "secondary" : "outline"
                  }>
                    {project.impactArea}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex gap-2 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-muted-foreground">{project.teamSize} members</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{project.duration}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.skillsNeeded.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {project.skillsNeeded.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.skillsNeeded.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <Button size="sm" className="w-full mt-4" variant="outline">
                  View Project <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline">
            View All Projects <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
