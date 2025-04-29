
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Shield, Leaf } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { GreenProject } from "@/types/projects";

interface ProjectCardProps {
  project: GreenProject;
  hasApplied: boolean;
}

export function ProjectCard({ project, hasApplied }: ProjectCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const { applyForProject, isSubmitting } = useProjectMarketplace();
  const { user } = useAuth();
  
  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for projects",
        variant: "destructive"
      });
      return;
    }
    
    await applyForProject(project.id, applicationMessage);
    setIsDialogOpen(false);
    setApplicationMessage("");
  };
  
  const getBadgeVariant = (impactArea: string) => {
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
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {project.description}
              </p>
            </div>
            <Badge className="capitalize" variant={getBadgeVariant(project.impactArea)}>
              {project.impactArea}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Team Size: {project.teamSize}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Duration: {project.duration}</span>
            </div>
            
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{project.location}</span>
              </div>
            )}
            
            {project.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Deadline: {formatDate(project.deadline)}</span>
              </div>
            )}
            
            {project.carbonReduction && (
              <div className="flex items-center gap-1 col-span-2">
                <Leaf className="h-3.5 w-3.5 text-green-500" />
                <span>CO₂ Reduction: {project.carbonReduction} tons</span>
              </div>
            )}
            
            {project.hasInsurance && (
              <div className="flex items-center gap-1 col-span-2">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">Insured Project</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Skills Needed:</h4>
            <div className="flex flex-wrap gap-2">
              {project.skillsNeeded.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline">View Details</Button>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            disabled={hasApplied}
          >
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Project: {project.title}</DialogTitle>
            <DialogDescription>
              Tell the project creator why you're interested and what skills you can bring to the team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Your message to the project creator..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleApply} 
              disabled={!applicationMessage.trim() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
