import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Smile } from "lucide-react";
import { MessageReaction } from '@/hooks/chat/types';

export interface MessageReactionsData {
  [emoji: string]: MessageReaction[];
}

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReactionsData;
  currentUserId?: string;
  onReact: (messageId: string, emoji: string) => void;
  className?: string;
}

const COMMON_EMOJIS = [
  '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉', 
  '👏', '🔥', '💯', '🤔', '😍', '🙄', '😎', '🤯'
];

export function MessageReactions({
  messageId,
  reactions,
  currentUserId,
  onReact,
  className = ""
}: MessageReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onReact(messageId, emoji);
    setIsPickerOpen(false);
  };

  const handleReactionToggle = (emoji: string) => {
    onReact(messageId, emoji);
  };

  // Convert reactions array to reactions data format if needed
  const reactionEntries = Object.entries(reactions || {}).filter(([, reactionList]) => 
    Array.isArray(reactionList) && reactionList.length > 0
  );

  if (reactionEntries.length === 0 && !currentUserId) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 mt-1 ${className}`}>
      {/* Existing reactions */}
      {reactionEntries.map(([emoji, reactionList]) => {
        const count = Array.isArray(reactionList) ? reactionList.length : 0;
        const isUserReaction = currentUserId && Array.isArray(reactionList) && 
          reactionList.some(r => r.user_id === currentUserId);
        
        if (count === 0) return null;

        return (
          <Badge
            key={emoji}
            variant={isUserReaction ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80 text-xs px-2 py-1 h-auto"
            onClick={() => handleReactionToggle(emoji)}
          >
            <span className="mr-1">{emoji}</span>
            {count}
          </Badge>
        );
      })}

      {/* Add reaction button */}
      {currentUserId && (
        <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsPickerOpen(true)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-auto p-3 bg-background border shadow-lg z-50" 
            align="start"
            side="top"
          >
            <div className="flex items-center gap-2 mb-2">
              <Smile className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Add reaction</span>
            </div>
            
            <div className="grid grid-cols-8 gap-1">
              {COMMON_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-base hover:bg-muted"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
