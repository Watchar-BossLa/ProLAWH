
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { Book, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NetworkCardActionsProps {
  connection: NetworkConnection;
  isHovered: boolean;
  onChatOpen?: (connectionId: string) => void;
  onMentorshipRequest?: () => void;
}

export function NetworkCardActions({ 
  connection, 
  isHovered, 
  onChatOpen, 
  onMentorshipRequest 
}: NetworkCardActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className={`flex gap-2 mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
      <Button 
        size="sm" 
        variant="default" 
        className="flex-1"
        onClick={() => onChatOpen && onChatOpen(connection.id)}
      >
        <MessageCircle size={16} />
        <span className="ml-1">Chat</span>
      </Button>
      
      {connection.connectionType === 'peer' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={onMentorshipRequest}
        >
          <Book size={16} />
          <span className="ml-1">Request Mentor</span>
        </Button>
      )}
      
      {connection.connectionType !== 'peer' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate(`/dashboard/network/${connection.id}`)}
        >
          <Users size={16} />
          <span className="ml-1">Profile</span>
        </Button>
      )}
    </div>
  );
}
