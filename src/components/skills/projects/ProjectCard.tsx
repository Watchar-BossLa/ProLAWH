
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, Leaf, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GreenProject } from "@/types/projects";

interface ProjectCardProps {
  project: GreenProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handleApply = (projectId: string) => {
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully"
    });
  };

  return (
    <Card className="bg-muted/40 hover:bg-muted/60 transition-all">
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
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-muted-foreground">{project.teamSize} members</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-muted-foreground">{project.duration}</span>
          </div>
          
          {project.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-muted-foreground">{project.location}</span>
            </div>
          )}
          
          {project.compensation && (
            <div className="flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-green-500" />
              <span className="text-muted-foreground">{project.compensation}</span>
            </div>
          )}
          
          {project.hasInsurance && (
            <div className="flex items-center gap-1 col-span-2">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-muted-foreground">Project includes gig insurance</span>
            </div>
          )}
          
          {project.carbonReduction && (
            <div className="flex items-center gap-1 col-span-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {project.carbonReduction}kg CO2 reduction
              </Badge>
            </div>
          )}
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
        
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          <Button className="flex-1" onClick={() => handleApply(project.id)}>
            Apply Now <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
