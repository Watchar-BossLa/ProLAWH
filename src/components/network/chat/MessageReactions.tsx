
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Heart, ThumbsUp, Laugh, Angry } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface MessageReactionsData {
  [emoji: string]: string[];
}

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReactionsData;
  currentUserId?: string;
  onReact: (messageId: string, emoji: string) => void;
}

const AVAILABLE_REACTIONS = [
  { emoji: "❤️", icon: Heart },
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "😂", icon: Laugh },
  { emoji: "😡", icon: Angry },
  { emoji: "😊", icon: Smile },
];

export function MessageReactions({ 
  messageId, 
  reactions, 
  currentUserId,
  onReact 
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onReact(messageId, emoji);
    setIsOpen(false);
  };

  const handleReactionClick = (emoji: string) => {
    onReact(messageId, emoji);
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {Object.entries(reactions).map(([emoji, userIds]) => {
        if (userIds.length === 0) return null;
        
        const hasCurrentUserReacted = currentUserId ? 
          userIds.includes(currentUserId) : false;
        
        return (
          <Badge 
            key={emoji} 
            variant={hasCurrentUserReacted ? "default" : "secondary"}
            className="text-xs py-0 px-1.5 cursor-pointer hover:opacity-80"
            onClick={() => handleReactionClick(emoji)}
          >
            {emoji} {userIds.length}
          </Badge>
        );
      })}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full"
            aria-label="Add reaction"
          >
            <Smile className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1 flex gap-1">
          {AVAILABLE_REACTIONS.map((reaction) => (
            <Button
              key={reaction.emoji}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEmojiClick(reaction.emoji)}
            >
              {reaction.emoji}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
