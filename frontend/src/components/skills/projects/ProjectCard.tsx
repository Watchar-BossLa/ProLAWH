
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Shield, Leaf, DollarSign } from "lucide-react";
import type { GreenProject } from "@/types/projects";

interface ProjectCardProps {
  project: GreenProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <Badge className="capitalize" variant={getBadgeVariant(project.impactArea)}>
            {project.impactArea}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Team Size: {project.teamSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {project.duration}</span>
          </div>
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{project.location}</span>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Deadline: {formatDate(project.deadline)}</span>
            </div>
          )}
          {project.carbonReduction && (
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span>CO₂ Reduction: {project.carbonReduction} tons</span>
            </div>
          )}
          {project.compensation && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{project.compensation}</span>
            </div>
          )}
          {project.hasInsurance && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">Insured Project</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {project.skillsNeeded.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Learn More</Button>
        <Button>Apply Now</Button>
      </CardFooter>
    </Card>
  );
}

function getBadgeVariant(impactArea: string): "default" | "outline" | "secondary" | "destructive" {
  switch (impactArea) {
    case "Climate":
      return "default";
    case "Conservation":
      return "secondary";
    case "Community":
      return "outline";
    default:
      return "outline";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
