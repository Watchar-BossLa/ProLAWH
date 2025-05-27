
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Video, MoreVertical, Wifi, WifiOff, Users } from "lucide-react";

interface ChatHeaderProps {
  chatName: string;
  isOnline: boolean;
  participantCount: number;
}

export function ChatHeader({ chatName, isOnline, participantCount }: ChatHeaderProps) {
  return (
    <CardHeader className="pb-3 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {chatName}
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {participantCount > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {participantCount} member{participantCount !== 1 ? 's' : ''}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
