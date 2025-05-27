
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";

interface ReadReceiptUser {
  id: string;
  name: string;
  avatar?: string;
  readAt: string;
}

interface ReadReceiptsProps {
  messageId: string;
  readBy: ReadReceiptUser[];
  currentUserId?: string;
  className?: string;
}

export function ReadReceipts({
  messageId,
  readBy,
  currentUserId,
  className = ""
}: ReadReceiptsProps) {
  // Filter out current user from read receipts
  const otherReaders = readBy.filter(user => user.id !== currentUserId);
  
  if (otherReaders.length === 0) {
    return null;
  }

  const formatReadTime = (timestamp: string) => {
    const now = new Date();
    const readTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - readTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return readTime.toLocaleDateString();
  };

  return (
    <div className={`flex items-center gap-2 mt-1 ${className}`}>
      <CheckCheck className="h-3 w-3 text-blue-500" />
      
      {otherReaders.length <= 3 ? (
        <div className="flex items-center gap-1">
          {otherReaders.map((user) => (
            <Avatar key={user.id} className="h-4 w-4">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
          <span className="text-xs text-muted-foreground">
            Read {formatReadTime(otherReaders[0].readAt)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {otherReaders.slice(0, 2).map((user) => (
            <Avatar key={user.id} className="h-4 w-4">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
          <Badge variant="secondary" className="h-4 text-xs">
            +{otherReaders.length - 2}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Read {formatReadTime(otherReaders[0].readAt)}
          </span>
        </div>
      )}
    </div>
  );
}
