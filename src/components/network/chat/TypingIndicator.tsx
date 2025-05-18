
import React from 'react';
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  isTyping: boolean;
  name?: string;
  className?: string;
}

export function TypingIndicator({ isTyping, name, className }: TypingIndicatorProps) {
  if (!isTyping) return null;
  
  return (
    <div className={cn("flex items-center text-xs text-muted-foreground italic py-1", className)}>
      <div className="flex gap-1 mr-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      {name ? `${name} is typing...` : 'Typing...'}
    </div>
  );
}
