
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NetworkConnection } from "@/types/network";

interface ChatHeaderProps {
  connection: NetworkConnection;
  onClose?: () => void;
}

export function SmartChatHeader({ connection, onClose }: ChatHeaderProps) {
  return (
    <div className="px-4 py-3 flex flex-row items-center justify-between border-b">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-2">
          {connection.avatar ? (
            <AvatarImage src={connection.avatar} alt={connection.name} />
          ) : (
            <AvatarFallback>
              {connection.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
          {connection.onlineStatus && (
            <div 
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                connection.onlineStatus === 'online' ? 'bg-green-500' : 
                connection.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
            />
          )}
        </Avatar>
        <div>
          <h3 className="text-base font-medium">{connection.name}</h3>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{connection.role} at {connection.company}</span>
            <span className="inline-flex w-1 h-1 bg-muted-foreground rounded-full mx-1"></span>
            <span className={`capitalize ${
              connection.onlineStatus === 'online' ? 'text-green-500' : 
              connection.onlineStatus === 'away' ? 'text-yellow-500' : 'text-gray-400'
            }`}>{connection.onlineStatus}</span>
          </div>
        </div>
      </div>

      {onClose && (
        <Button variant="ghost" size="icon" onClick={onClose}>
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </Button>
      )}
    </div>
  );
}
