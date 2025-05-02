
import { useState } from "react";
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { MentorshipTools } from "./MentorshipTools";
import { PeerCollaborationTools } from "./PeerCollaborationTools";
import { ProfessionalTools } from "./ProfessionalTools";
import { BookOpen, Users, Briefcase } from "lucide-react";

interface RelationshipToolsProps {
  connection: NetworkConnection;
  onClose: () => void;
}

export function RelationshipTools({ connection, onClose }: RelationshipToolsProps) {
  const [activeTab, setActiveTab] = useState<string>("main");
  
  const getTitle = () => {
    switch(connection.connectionType) {
      case 'mentor': return 'Mentorship Tools';
      case 'peer': return 'Collaboration Tools';
      case 'colleague': return 'Professional Tools';
      default: return 'Relationship Tools';
    }
  };
  
  const getDescription = () => {
    switch(connection.connectionType) {
      case 'mentor': 
        return 'Tools to maximize your mentorship relationship with this connection.';
      case 'peer': 
        return 'Tools to collaborate with peers in your learning journey.';
      case 'colleague': 
        return 'Professional resources to enhance your work relationship.';
      default: 
        return 'Tools to strengthen your professional connection.';
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogDescription>
          {getDescription()}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="main">
            {connection.connectionType === 'mentor' ? 
              <><BookOpen className="w-4 h-4 mr-2" /> Mentorship</> : 
              connection.connectionType === 'peer' ?
                <><Users className="w-4 h-4 mr-2" /> Collaboration</> :
                <><Briefcase className="w-4 h-4 mr-2" /> Professional</>
            }
          </TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4 min-h-[300px]">
          {connection.connectionType === 'mentor' && (
            <MentorshipTools connection={connection} />
          )}
          
          {connection.connectionType === 'peer' && (
            <PeerCollaborationTools connection={connection} />
          )}
          
          {connection.connectionType === 'colleague' && (
            <ProfessionalTools connection={connection} />
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4 min-h-[300px]">
          <div className="p-6 text-center text-muted-foreground">
            <p>Shared resources will appear here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4 min-h-[300px]">
          <div className="p-6 text-center text-muted-foreground">
            <p>Schedule meetings and set reminders here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
}
