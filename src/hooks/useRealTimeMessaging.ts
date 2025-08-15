
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessageFetching } from './messaging/hooks/useMessageFetching';
import { useMessageActions } from './messaging/hooks/useMessageActions';
import { useChatRooms } from './messaging/hooks/useChatRooms';
import { useRealtimeSubscription } from './messaging/hooks/useRealtimeSubscription';

// Re-export types for backward compatibility
export type { RealTimeMessage, ChatRoom } from './messaging/types';

export function useRealTimeMessaging() {
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const {
    messages,
    setMessages,
    isLoading,
    error,
    fetchMessages: baseFetchMessages
  } = useMessageFetching(user?.id);

  const { chatRooms, fetchChatRooms } = useChatRooms(user?.id);

  const fetchMessages = () => baseFetchMessages(undefined, currentRoom || undefined);

  const {
    sendMessage,
    addReaction,
    markAsRead
  } = useMessageActions({
    userId: user?.id,
    currentRoom,
    messages,
    setMessages,
    fetchMessages
  });

  useRealtimeSubscription({
    userId: user?.id,
    currentRoom,
    fetchMessages
  });

  const joinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    baseFetchMessages(roomId);
  };

  return {
    messages,
    chatRooms,
    currentRoom,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    addReaction,
    joinRoom,
    fetchMessages,
    fetchChatRooms
  };
}
