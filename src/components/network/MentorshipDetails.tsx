
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  MentorshipDetails as IMentorshipDetails,
  MentorshipResource,
  MentorshipProgress
} from "@/types/network";
import { BookOpen, Calendar, Check, FileText, Link, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MentorshipDetailsProps {
  mentorship: IMentorshipDetails;
  isOwnProfile?: boolean;
  isMentor?: boolean;
}

export function MentorshipDetails({ mentorship, isOwnProfile = false, isMentor = false }: MentorshipDetailsProps) {
  const [selectedResource, setSelectedResource] = useState<MentorshipResource | null>(null);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newNote, setNewNote] = useState("");
  
  const calculateProgress = () => {
    if (!mentorship.progress || mentorship.progress.length === 0) return 0;
    const completedCount = mentorship.progress.filter(p => p.completed).length;
    return Math.round((completedCount / mentorship.progress.length) * 100);
  };
  
  const progressPercentage = calculateProgress();
  
  const resourceTypeIcons = {
    'article': <FileText className="h-4 w-4" />,
    'video': <Video className="h-4 w-4" />,
    'book': <BookOpen className="h-4 w-4" />,
    'course': <FileText className="h-4 w-4" />,
    'tool': <Link className="h-4 w-4" />,
    'other': <Link className="h-4 w-4" />,
  };
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, this would save to the database
    console.log("Adding note:", newNote);
    setNewNote("");
    
    // Mock success message
    alert("Note added successfully!");
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mentorship Details</span>
            <Badge variant={mentorship.status === 'active' ? "default" : "outline"}>
              {mentorship.status.charAt(0).toUpperCase() + mentorship.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
            <div className="flex flex-wrap gap-1">
              {mentorship.focusAreas.map((area, i) => (
                <Badge key={i} variant="secondary">{area}</Badge>
              ))}
            </div>
          </div>
          
          {mentorship.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Started on {new Date(mentorship.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {mentorship.meetingFrequency && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Meeting {mentorship.meetingFrequency}
              </span>
            </div>
          )}
          
          {mentorship.industry && (
            <div>
              <h4 className="text-sm font-medium mb-2">Industry</h4>
              <Badge>{mentorship.industry}</Badge>
            </div>
          )}
          
          {mentorship.goals && mentorship.goals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Goals</h4>
              <ul className="space-y-1">
                {mentorship.goals.map((goal, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {mentorship.progress && mentorship.progress.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Progress</h4>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Resources</h4>
              {(isOwnProfile || isMentor) && (
                <Button variant="outline" size="sm" onClick={() => setShowAddResource(true)}>
                  Add Resource
                </Button>
              )}
            </div>
            
            {mentorship.resources && mentorship.resources.length > 0 ? (
              <div className="space-y-2">
                {mentorship.resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="p-3 border rounded-md flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="bg-muted rounded-md p-2">
                      {resourceTypeIcons[resource.type]}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{resource.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">
                        {resource.description || "Click to view details"}
                      </p>
                    </div>
                    {resource.completed && (
                      <Badge variant="outline" className="ml-auto">Completed</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No resources added yet.</p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-2 justify-between">
            <Button 
              variant={mentorship.status === 'active' ? "default" : "outline"}
              size="sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Progress Note
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource Dialog */}
      <Dialog open={selectedResource !== null} onOpenChange={() => setSelectedResource(null)}>
        {selectedResource && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedResource.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Badge>{selectedResource.type}</Badge>
              
              {selectedResource.description && (
                <p className="text-sm">{selectedResource.description}</p>
              )}
              
              {selectedResource.url && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(selectedResource.url, '_blank')}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Open Resource
                </Button>
              )}
              
              {!selectedResource.completed && (
                <Button className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Add a note about this resource</h4>
                <Textarea 
                  placeholder="Your thoughts or notes about this resource..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleAddNote} className="mt-2">Save Note</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
