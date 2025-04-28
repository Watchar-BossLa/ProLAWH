
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ChatActionProps {
  connectionId: string;
  onChatOpen?: (connectionId: string) => void;
  isHovered: boolean;
}

export function ChatAction({ connectionId, onChatOpen, isHovered }: ChatActionProps) {
  return (
    <Button 
      size="sm" 
      variant="default" 
      className="flex-1"
      onClick={() => onChatOpen && onChatOpen(connectionId)}
    >
      <MessageCircle size={16} />
      <span className="ml-1">Chat</span>
    </Button>
  );
}
