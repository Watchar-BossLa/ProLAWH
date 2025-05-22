
import { toast } from "sonner";
import { AttachmentType } from "@/components/network/chat/MessageAttachment";

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

interface ChatHandlersProps {
  user: any;
  updateTypingStatus: (isTyping: boolean, recipientId?: string | null) => void;
  sendMessage: (params: {
    content: string;
    sender_id: string;
    receiver_id: string;
    attachment_data?: any;
  }) => Promise<any>;
  reactToMessage: (messageId: string, emoji: string) => void;
}

export function useChatHandlers({
  user,
  updateTypingStatus,
  sendMessage,
  reactToMessage
}: ChatHandlersProps) {
  
  const handleSendMessage = async (messageText: string, attachments: AttachmentData[], recipientId?: string) => {
    if ((!messageText.trim() && attachments.length === 0) || !user) return;
    
    // Disable typing indicator
    updateTypingStatus(false);
    
    // Send message with correct parameters and any attachments
    try {
      await sendMessage({
        content: messageText,
        sender_id: user.id,
        receiver_id: recipientId || '',
        attachment_data: attachments.length > 0 ? attachments : undefined
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  
  const handleTypingUpdate = (isTyping: boolean, recipientId?: string) => {
    updateTypingStatus(isTyping, isTyping ? recipientId : null);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    reactToMessage(messageId, emoji);
  };
  
  return {
    handleSendMessage,
    handleTypingUpdate,
    handleReactToMessage
  };
}
