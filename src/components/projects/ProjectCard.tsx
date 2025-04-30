
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Clock, Leaf, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GreenProject } from "@/types/projects";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { SkillStaking } from "./SkillStaking";

interface ProjectCardProps {
  project: GreenProject;
  hasApplied?: boolean;
  isOwnProject?: boolean;
}

export function ProjectCard({ project, hasApplied = false, isOwnProject = false }: ProjectCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { applyForProject, isSubmitting } = useProjectMarketplace();

  const handleApply = async () => {
    try {
      await applyForProject(project.id, message);
      setIsDialogOpen(false);
      setMessage("");
    } catch (error) {
      console.error("Application failed:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.category}</CardDescription>
          </div>
          <div className="space-x-2">
            {project.impactArea && (
              <Badge variant={project.impactArea === "Climate" ? "default" : 
                project.impactArea === "Conservation" ? "secondary" : "outline"}>
                {project.impactArea}
              </Badge>
            )}
            {project.hasInsurance && <Badge variant="success"><Shield className="h-3 w-3 mr-1" /> Insured</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {project.location && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{project.teamSize} team members</span>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {project.duration && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration: {project.duration}</span>
            </div>
          )}
          {project.carbonReduction && project.carbonReduction > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground col-span-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span>CO₂ Reduction: {project.carbonReduction} tons</span>
            </div>
          )}
        </div>

        {project.skillsNeeded && project.skillsNeeded.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {project.skillsNeeded.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {!isOwnProject && !hasApplied && (
          <Button 
            className="w-full" 
            onClick={() => setIsDialogOpen(true)}
            disabled={!user}
          >
            Apply Now
          </Button>
        )}
        
        {hasApplied && (
          <Badge variant="success" className="w-full justify-center py-2">
            Application Submitted
          </Badge>
        )}
        
        {isOwnProject && (
          <Badge variant="outline" className="w-full justify-center py-2">
            Your Project
          </Badge>
        )}

        {!isOwnProject && !hasApplied && (
          <SkillStaking projectId={project.id} hasApplied={hasApplied} />
        )}
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {project.title}</DialogTitle>
            <DialogDescription>
              Introduce yourself and explain why you're a good fit for this project.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="I'm interested in this project because..."
            className="min-h-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApply} disabled={isSubmitting || !message.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
