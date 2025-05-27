
import React from "react";

interface TypingUser {
  user_id: string;
  user_name?: string;
}

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
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
}
