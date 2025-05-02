
import { NetworkConnection } from "@/types/network";
import { ChatAction } from "./actions/ChatAction";
import { MentorRequestAction } from "./actions/MentorRequestAction";
import { ProfileAction } from "./actions/ProfileAction";
import { RelationshipToolsAction } from "./actions/RelationshipToolsAction";

interface NetworkCardActionsProps {
  connection: NetworkConnection;
  isHovered: boolean;
  onChatOpen?: (connectionId: string) => void;
  onMentorshipRequest?: () => void;
  onShowTools?: () => void;
}

export function NetworkCardActions({ 
  connection, 
  isHovered, 
  onChatOpen, 
  onMentorshipRequest,
  onShowTools
}: NetworkCardActionsProps) {
  return (
    <div className={`flex flex-wrap gap-2 mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
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
      
      {onShowTools && (
        <RelationshipToolsAction
          connectionType={connection.connectionType}
          onShowTools={onShowTools}
          isHovered={isHovered}
        />
      )}
      
      <ProfileAction 
        connectionId={connection.id}
        isHovered={isHovered}
      />
    </div>
  );
}
