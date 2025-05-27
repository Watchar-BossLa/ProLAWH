import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Plus } from "lucide-react";
import { MessageReaction } from "@/hooks/useRealTimeChat";
import { useAuth } from "@/hooks/useAuth";

interface MessageReactionPickerProps {
  messageId: string;
  reactions: MessageReaction[];
  onAddReaction: (messageId: string, reaction: string) => void;
  onRemoveReaction: (messageId: string, reaction: string) => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

export function MessageReactionPicker({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction
}: MessageReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = [];
    }
    acc[reaction.reaction].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  const handleReactionClick = (emoji: string) => {
    if (!user) return;

    const userReaction = reactions.find(r => r.user_id === user.id && r.reaction === emoji);
    
    if (userReaction) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(messageId, emoji);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Existing reactions */}
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
        const isUserReaction = user && reactionList.some(r => r.user_id === user.id);
        return (
          <Badge
            key={emoji}
            variant={isUserReaction ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80 text-xs"
            onClick={() => handleReactionClick(emoji)}
          >
            {emoji} {reactionList.length}
          </Badge>
        );
      })}

      {/* Add reaction button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full opacity-50 hover:opacity-100"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {COMMON_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-muted"
                onClick={() => handleEmojiSelect(emoji)}
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
