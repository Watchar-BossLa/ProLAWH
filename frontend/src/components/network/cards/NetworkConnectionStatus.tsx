
import React from 'react';
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { cn } from "@/lib/utils";

interface NetworkConnectionStatusProps {
  userId: string;
  showLabel?: boolean;
  className?: string;
}

export function NetworkConnectionStatus({ userId, showLabel = false, className }: NetworkConnectionStatusProps) {
  const { getUserStatus } = usePresenceStatus();
  const status = getUserStatus(userId);
  
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span 
        className={cn(
          "h-2 w-2 rounded-full", 
          statusColors[status.status],
          "animate-pulse",
          status.status === "online" ? "animate-pulse" : ""
        )} 
        aria-hidden="true" 
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground capitalize">
          {status.status}
          {status.status === "away" && status.lastActive && (
            <span className="ml-1">
              ({new Date(status.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
