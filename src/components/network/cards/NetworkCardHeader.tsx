
import React from 'react';
import { CardHeader } from "@/components/ui/card";
import { NetworkConnection } from "@/types/network";
import { NetworkConnectionInfo } from "./NetworkConnectionInfo";
import { VoiceControl } from "@/components/voice/VoiceControl";

interface NetworkCardHeaderProps {
  connection: NetworkConnection;
  showMentorshipBadge: boolean;
}

export function NetworkCardHeader({ connection, showMentorshipBadge }: NetworkCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <NetworkConnectionInfo 
        connection={connection}
        showMentorshipBadge={showMentorshipBadge}
      />
      <div className="ml-auto">
        <VoiceControl text={`Hi, I'm ${connection.name}, a ${connection.role} at ${connection.company}.`} />
      </div>
    </CardHeader>
  );
}
