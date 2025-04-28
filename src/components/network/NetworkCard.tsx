
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { MentorshipRequestForm } from "./mentorship/form/MentorshipRequestForm";
import { NetworkCardStatus } from "./cards/NetworkCardStatus";
import { NetworkCardHeader } from "./cards/NetworkCardHeader";
import { NetworkCardContent } from "./cards/NetworkCardContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SmartChatInterface } from "./SmartChatInterface";
import { toast } from "sonner";

interface NetworkCardProps {
  connection: NetworkConnection;
  onChatOpen?: (connectionId: string) => void;
}

export function NetworkCard({ connection, onChatOpen }: NetworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const [showSmartChat, setShowSmartChat] = useState(false);
  
  const showMentorshipBadge = connection.connectionType === 'mentor' && 
    connection.mentorship && 
    (connection.mentorship.status === 'active' || connection.mentorship.status === 'pending');

  const handleMentorshipRequest = (request: MentorshipRequest) => {
    console.log("Mentorship request:", request);
    // Fixed toast usage to match sonner's API
    toast("Mentorship Request Sent", {
      description: `Your mentorship request has been sent to ${connection.name}.`
    });
    setShowMentorshipForm(false);
  };
  
  const handleChatClick = () => {
    if (onChatOpen) {
      onChatOpen(connection.id);
    } else {
      setShowSmartChat(true);
    }
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
        onChatOpen={handleChatClick}
        onMentorshipRequest={() => setShowMentorshipForm(true)}
      />
      
      <MentorshipRequestForm
        connection={connection}
        isOpen={showMentorshipForm}
        onClose={() => setShowMentorshipForm(false)}
        onSubmit={handleMentorshipRequest}
      />
      
      <Dialog open={showSmartChat} onOpenChange={setShowSmartChat}>
        <DialogContent className="sm:max-w-[500px] p-0 h-[600px]">
          <SmartChatInterface 
            connection={connection} 
            onClose={() => setShowSmartChat(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
