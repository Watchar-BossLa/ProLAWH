import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { MentorshipRequestForm } from "./mentorship/form/MentorshipRequestForm";
import { toast } from "@/hooks/use-toast";
import { NetworkConnectionInfo } from "./cards/NetworkConnectionInfo";
import { NetworkCardStatus } from "./cards/NetworkCardStatus";
import { NetworkConnectionStrength } from "./cards/NetworkConnectionStrength";
import { NetworkCardActions } from "./cards/NetworkCardActions";
import { NetworkCardMentorship } from "./cards/NetworkCardMentorship";

interface NetworkCardProps {
  connection: NetworkConnection;
  onChatOpen?: (connectionId: string) => void;
}

export function NetworkCard({ connection, onChatOpen }: NetworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  
  const showMentorshipBadge = connection.connectionType === 'mentor' && 
    connection.mentorship && 
    (connection.mentorship.status === 'active' || connection.mentorship.status === 'pending');

  const handleMentorshipRequest = (request: MentorshipRequest) => {
    console.log("Mentorship request:", request);
    toast({
      title: "Mentorship Request Sent",
      description: `Your mentorship request has been sent to ${connection.name}.`,
    });
  };

  return (
    <Card 
      className="hover-card glass-card transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NetworkCardStatus connection={connection} />
      
      <CardHeader className="flex flex-row items-center gap-4">
        <NetworkConnectionInfo 
          connection={connection}
          showMentorshipBadge={showMentorshipBadge}
        />
      </CardHeader>
      
      <CardContent className="grid gap-2">
        <div className="text-sm">
          <span className="font-medium">Connection:</span>{" "}
          <Badge variant="outline" className="capitalize">
            {connection.connectionType}
          </Badge>
        </div>
        
        {connection.skills && connection.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {connection.skills.slice(0, 2).map(skill => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {connection.skills.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{connection.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        <NetworkConnectionStrength connection={connection} />
        
        <NetworkCardActions
          connection={connection}
          isHovered={isHovered}
          onChatOpen={onChatOpen}
          onMentorshipRequest={() => setShowMentorshipForm(true)}
        />
        
        <NetworkCardMentorship connection={connection} />
      </CardContent>
      
      <MentorshipRequestForm
        connection={connection}
        isOpen={showMentorshipForm}
        onClose={() => setShowMentorshipForm(false)}
        onSubmit={handleMentorshipRequest}
      />
    </Card>
  );
}
