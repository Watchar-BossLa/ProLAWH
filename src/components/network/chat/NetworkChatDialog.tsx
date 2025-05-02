
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NetworkConnection } from "@/types/network";
import { ChatInterface } from "@/components/network/ChatInterface";

interface NetworkChatDialogProps {
  activeChatId: string | null;
  activeChatConnection: NetworkConnection | undefined;
  onClose: () => void;
}

export function NetworkChatDialog({
  activeChatId,
  activeChatConnection,
  onClose
}: NetworkChatDialogProps) {
  return (
    <Dialog open={activeChatId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] overflow-hidden">
        {activeChatConnection && (
          <ChatInterface
            connection={activeChatConnection}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
