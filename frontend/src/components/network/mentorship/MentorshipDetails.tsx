
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog } from "@/components/ui/dialog";
import { MentorshipDetails as IMentorshipDetails, MentorshipResource } from "@/types/network";
import { MentorshipResourceDialog } from "./MentorshipResourceDialog";
import { MentorshipProgress } from "./MentorshipProgress";
import { MentorshipGoals } from "./MentorshipGoals";
import { MentorshipActions } from "./MentorshipActions";
import { MentorshipFocusAreas } from "./MentorshipFocusAreas";
import { MentorshipDates } from "./MentorshipDates";
import { MentorshipResources } from "./MentorshipResources";

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
        <MentorshipFocusAreas 
          focusAreas={mentorship.focusAreas}
          industry={mentorship.industry}
        />
        
        <MentorshipDates 
          startDate={mentorship.startDate}
          meetingFrequency={mentorship.meetingFrequency}
        />
        
        <MentorshipGoals goals={mentorship.goals} />
        
        <MentorshipProgress progress={mentorship.progress} />
        
        <MentorshipResources 
          resources={mentorship.resources}
          isOwnProfile={isOwnProfile}
          isMentor={isMentor}
          onResourceClick={setSelectedResource}
          onAddResource={() => setShowAddResource(true)}
        />
        
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
