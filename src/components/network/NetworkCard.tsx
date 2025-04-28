
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { MentorshipRequestForm } from "./mentorship/form/MentorshipRequestForm";
import { NetworkCardStatus } from "./cards/NetworkCardStatus";
import { NetworkCardHeader } from "./cards/NetworkCardHeader";
import { NetworkCardContent } from "./cards/NetworkCardContent";

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
      <NetworkCardHeader 
        connection={connection}
        showMentorshipBadge={showMentorshipBadge}
      />
      <NetworkCardContent 
        connection={connection}
        isHovered={isHovered}
        onChatOpen={onChatOpen}
        onMentorshipRequest={() => setShowMentorshipForm(true)}
      />
      
      <MentorshipRequestForm
        connection={connection}
        isOpen={showMentorshipForm}
        onClose={() => setShowMentorshipForm(false)}
        onSubmit={handleMentorshipRequest}
      />
    </Card>
  );
}
