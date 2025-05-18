
import React from "react";
import { NetworkConnection } from "@/types/network";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";

interface ChatHeaderProps {
  connection: NetworkConnection;
  onClose: () => void;
}

export function ChatHeader({ connection, onClose }: ChatHeaderProps) {
  const { getUserStatus } = usePresenceStatus();
  const connectionStatus = getUserStatus(connection.id);
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
      <div className="flex items-center space-x-3">
        <Avatar className="h-9 w-9 relative">
          {connection.avatar ? (
            <AvatarImage src={connection.avatar} alt={connection.name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {connection.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
          <div 
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
              connectionStatus.status === 'online' ? 'bg-green-500' : 
              connectionStatus.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}
          />
        </Avatar>
        <div>
          <h3 className="font-medium">{connection.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{connection.role} · {connection.company}</span>
            <span className="inline-flex w-1 h-1 bg-muted-foreground rounded-full mx-1"></span>
            <span className={
              connectionStatus.status === 'online' ? 'text-green-500' : 
              connectionStatus.status === 'away' ? 'text-yellow-500' : 'text-gray-400'
            }>
              {connectionStatus.status}
            </span>
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
