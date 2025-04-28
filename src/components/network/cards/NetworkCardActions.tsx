
import { NetworkConnection } from "@/types/network";
import { ChatAction } from "./actions/ChatAction";
import { MentorRequestAction } from "./actions/MentorRequestAction";
import { ProfileAction } from "./actions/ProfileAction";

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
  return (
    <div className={`flex gap-2 mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
      <ChatAction 
        connectionId={connection.id}
        onChatOpen={onChatOpen}
        isHovered={isHovered}
      />
      
      {connection.connectionType === 'peer' && onMentorshipRequest && (
        <MentorRequestAction 
          onMentorshipRequest={onMentorshipRequest}
          isHovered={isHovered}
        />
      )}
      
      {connection.connectionType !== 'peer' && (
        <ProfileAction 
          connectionId={connection.id}
          isHovered={isHovered}
        />
      )}
    </div>
  );
}
