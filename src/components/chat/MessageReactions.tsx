
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface Message {
  id: string;
  reactions: Record<string, string[]>;
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

  return (
    <div className="flex items-center gap-1 mt-1">
      {Object.entries(message.reactions || {}).map(([emoji, userIds]) => (
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
