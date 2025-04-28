
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkConnection } from "@/types/network";
import { NetworkConnectionStrength } from "./NetworkConnectionStrength";
import { NetworkCardActions } from "./NetworkCardActions";
import { NetworkCardMentorship } from "./NetworkCardMentorship";

interface NetworkCardContentProps {
  connection: NetworkConnection;
  isHovered: boolean;
  onChatOpen?: (connectionId: string) => void;
  onMentorshipRequest?: () => void;
}

export function NetworkCardContent({ 
  connection, 
  isHovered,
  onChatOpen,
  onMentorshipRequest 
}: NetworkCardContentProps) {
  return (
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
        onMentorshipRequest={onMentorshipRequest}
      />
      
      <NetworkCardMentorship connection={connection} />
    </CardContent>
  );
}
