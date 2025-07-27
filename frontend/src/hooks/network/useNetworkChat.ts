
import { useState } from 'react';
import { NetworkConnection } from '@/types/network';

export function useNetworkChat() {
  const [activeChatConnection, setActiveChatConnection] = useState<NetworkConnection | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = (connection: NetworkConnection) => {
    setActiveChatConnection(connection);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setActiveChatConnection(null);
    setIsChatOpen(false);
  };

  const handleChatOpen = (connectionId: string, connections: NetworkConnection[]) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      openChat(connection);
    }
  };

  return {
    activeChatConnection,
    isChatOpen,
    openChat,
    closeChat,
    handleChatOpen
  };
}
