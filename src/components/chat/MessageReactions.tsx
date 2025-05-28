
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

interface Message {
  id: string;
  reactions: MessageReaction[];
}

interface MessageReactionsProps {
  message: Message;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉'];

export function MessageReactions({ message, onAddReaction, onRemoveReaction }: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onAddReaction(message.id, emoji);
    setShowEmojiPicker(false);
  };

  const handleReactionClick = (emoji: string) => {
    onRemoveReaction(message.id, emoji);
  };

  // Group reactions by emoji
  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction]) {
      acc[reaction.reaction] = [];
    }
    acc[reaction.reaction].push(reaction.user_id);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="flex items-center gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, userIds]) => (
        <Badge
          key={emoji}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80 text-xs px-2 py-1"
          onClick={() => handleReactionClick(emoji)}
        >
          {emoji} {userIds.length}
        </Badge>
      ))}
      
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="grid grid-cols-4 gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-accent"
                onClick={() => handleEmojiClick(emoji)}
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
