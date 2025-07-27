
import { ChatRoom } from '../types';

export class ChatRoomService {
  static async fetchChatRooms(userId: string): Promise<ChatRoom[]> {
    if (!userId) return [];

    try {
      // For now, we'll create a simple room structure
      const mockRooms: ChatRoom[] = [
        {
          id: 'general',
          name: 'General',
          type: 'public',
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_private: false,
          member_count: 1,
          last_activity: new Date().toISOString(),
          chat_participants: [{ user_id: userId }],
          last_message: null
        }
      ];

      return mockRooms;
    } catch (err) {
      console.error('Error fetching chat rooms:', err);
      return [];
    }
  }
}
