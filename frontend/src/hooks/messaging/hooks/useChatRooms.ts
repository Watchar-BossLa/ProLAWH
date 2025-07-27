
import { useState, useCallback, useEffect } from 'react';
import { ChatRoom } from '../types';
import { ChatRoomService } from '../services/chatRoomService';

export function useChatRooms(userId: string | undefined) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const fetchChatRooms = useCallback(async () => {
    if (!userId) return;

    const rooms = await ChatRoomService.fetchChatRooms(userId);
    setChatRooms(rooms);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchChatRooms();
    }
  }, [userId, fetchChatRooms]);

  return {
    chatRooms,
    fetchChatRooms
  };
}
