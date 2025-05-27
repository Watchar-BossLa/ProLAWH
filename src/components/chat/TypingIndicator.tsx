
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TypingUser } from "@/hooks/useRealTimeChat";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].user_name || 'Someone'} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].user_name || 'Someone'} and ${typingUsers[1].user_name || 'someone'} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 opacity-70">
      <div className="flex -space-x-2">
        {typingUsers.slice(0, 3).map((user, index) => (
          <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-xs">
              {user.user_name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>{getTypingText()}</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
