
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { MentorshipDetails as IMentorshipDetails, MentorshipResource } from "@/types/network";
import { MentorshipResourceItem } from "./MentorshipResourceItem";
import { MentorshipResourceDialog } from "./MentorshipResourceDialog";
import { MentorshipProgress } from "./MentorshipProgress";
import { MentorshipGoals } from "./MentorshipGoals";
import { MentorshipActions } from "./MentorshipActions";

interface MentorshipDetailsProps {
  mentorship: IMentorshipDetails;
  isOwnProfile?: boolean;
  isMentor?: boolean;
}

export function MentorshipDetails({ 
  mentorship, 
  isOwnProfile = false, 
  isMentor = false 
}: MentorshipDetailsProps) {
  const [selectedResource, setSelectedResource] = useState<MentorshipResource | null>(null);
  const [showAddResource, setShowAddResource] = useState(false);
  
  const handleAddNote = (note: string) => {
    if (!note.trim()) return;
    console.log("Adding note:", note);
    alert("Note added successfully!");
  };

  return (
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
        
        <MentorshipGoals goals={mentorship.goals} />
        
        <MentorshipProgress progress={mentorship.progress} />
        
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
                <MentorshipResourceItem
                  key={resource.id}
                  resource={resource}
                  onClick={() => setSelectedResource(resource)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No resources added yet.</p>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <MentorshipActions status={mentorship.status} />
      </CardContent>

      <Dialog 
        open={selectedResource !== null} 
        onOpenChange={() => setSelectedResource(null)}
      >
        <MentorshipResourceDialog
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onAddNote={handleAddNote}
        />
      </Dialog>
    </Card>
  );
}
