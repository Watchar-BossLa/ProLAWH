
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Shield, Leaf, DollarSign, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { GreenProject } from "@/types/projects";

interface ProjectCardProps {
  project: GreenProject;
  hasApplied: boolean;
  isOwnProject: boolean;
}

export function ProjectCard({ project, hasApplied, isOwnProject }: ProjectCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const { applyForProject, deleteProject, isSubmitting } = useProjectMarketplace();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for projects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await applyForProject(project.id, applicationMessage);
      setIsDialogOpen(false);
      setApplicationMessage("");
    } catch (error) {
      console.error("Application error:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete project error:", error);
    }
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
            
            {project.carbonReduction > 0 && (
              <div className="flex items-center gap-1 col-span-2">
                <Leaf className="h-3.5 w-3.5 text-green-500" />
                <span>CO₂ Reduction: {project.carbonReduction} tons</span>
              </div>
            )}
            
            {project.compensation && (
              <div className="flex items-center gap-1 col-span-2">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{project.compensation}</span>
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
          <Button variant="outline" onClick={() => setIsViewDetailsOpen(true)}>View Details</Button>
          {isOwnProject ? (
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              disabled={hasApplied || isSubmitting}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Apply Dialog */}
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

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
            <Badge className="w-fit capitalize mt-2" variant={getBadgeVariant(project.impactArea)}>
              {project.impactArea}
            </Badge>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Team Size</h3>
                <p className="text-sm text-muted-foreground">{project.teamSize} members</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Duration</h3>
                <p className="text-sm text-muted-foreground">{project.duration}</p>
              </div>
              
              {project.location && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">{project.location}</p>
                </div>
              )}
              
              {project.deadline && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Deadline</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(project.deadline)}</p>
                </div>
              )}

              {project.compensation && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Compensation</h3>
                  <p className="text-sm text-muted-foreground">{project.compensation}</p>
                </div>
              )}
              
              {project.carbonReduction > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-1">CO₂ Reduction</h3>
                  <p className="text-sm text-muted-foreground">{project.carbonReduction} tons</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {project.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {project.hasInsurance && (
              <div>
                <h3 className="text-sm font-medium mb-1">Insurance Details</h3>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">This project is insured</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Object.entries(project.insuranceDetails).length > 0 
                    ? Object.entries(project.insuranceDetails).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))
                    : "No additional insurance details provided."}
                </p>
              </div>
            )}
            
            {project.sdgAlignment && project.sdgAlignment.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">SDG Alignment</h3>
                <div className="flex flex-wrap gap-2">
                  {project.sdgAlignment.map((sdg, index) => (
                    <Badge key={index} variant="secondary">
                      {sdg}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            {!isOwnProject && (
              <Button 
                onClick={() => {
                  setIsViewDetailsOpen(false);
                  setIsDialogOpen(true);
                }}
                disabled={hasApplied}
              >
                {hasApplied ? "Already Applied" : "Apply Now"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
