import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

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
  const groupedReactions = Array.isArray(reactions) ? reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = [];
    }
    acc[reaction.reaction].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>) : {};

  const handleReactionClick = (emoji: string) => {
    if (!user) return;

    const userReaction = Array.isArray(reactions) ? reactions.find(r => r.user_id === user.id && r.reaction === emoji) : null;
    
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
        const isUserReaction = user && Array.isArray(reactionList) && reactionList.some(r => r.user_id === user.id);
        const count = Array.isArray(reactionList) ? reactionList.length : 0;
        return (
          <Badge
            key={emoji}
            variant={isUserReaction ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80 text-xs"
            onClick={() => handleReactionClick(emoji)}
          >
            {emoji} {count}
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
