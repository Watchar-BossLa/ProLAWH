import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile, Plus } from "lucide-react";

interface MessageReactionsProps {
  messageId: string;
  reactions: Record<string, string[]>;
  currentUserId?: string;
  onReact: (messageId: string, emoji: string) => void;
}

const commonEmojis = ['👍', '❤️', '😄', '😢', '😮', '😡', '👏', '🔥'];

export function MessageReactions({ 
  messageId, 
  reactions, 
  currentUserId, 
  onReact 
}: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
    setShowEmojiPicker(false);
  };

  const hasReactions = Object.keys(reactions).length > 0;
  const userReactions = currentUserId ? 
    Object.entries(reactions).filter(([_, userIds]) => userIds.includes(currentUserId)) : [];

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* Existing reactions */}
      {Object.entries(reactions).map(([emoji, userIds]) => {
        if (userIds.length === 0) return null;
        
        const hasUserReacted = currentUserId && userIds.includes(currentUserId);
        
        return (
          <Button
            key={emoji}
            variant={hasUserReacted ? "default" : "secondary"}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => handleReaction(emoji)}
          >
            {emoji} {userIds.length}
          </Button>
        );
      })}
      
      {/* Add reaction button */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-base"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
