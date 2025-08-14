import { cacheUtils, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { ChatMessage, ChatRoom } from '@/hooks/chat/types';

export class CacheService {
  // Chat Messages
  static async getChatMessages(connectionId: string): Promise<ChatMessage[] | null> {
    try {
      return await cacheUtils.getWithFallback(
        CACHE_KEYS.CHAT_MESSAGES(connectionId),
        () => Promise.resolve([]), // Will be filled by fallback to Supabase
        CACHE_TTL.CHAT_MESSAGES
      );
    } catch (error) {
      console.warn('Cache get messages error:', error);
      return null;
    }
  }

  static async setChatMessages(connectionId: string, messages: ChatMessage[]): Promise<void> {
    await cacheUtils.set(
      CACHE_KEYS.CHAT_MESSAGES(connectionId),
      messages,
      CACHE_TTL.CHAT_MESSAGES
    );
  }

  static async addMessage(connectionId: string, message: ChatMessage): Promise<void> {
    try {
      const cached = await this.getChatMessages(connectionId);
      if (cached) {
        const updated = [message, ...cached.slice(0, 49)]; // Keep last 50 messages
        await this.setChatMessages(connectionId, updated);
      }
    } catch (error) {
      console.warn('Cache add message error:', error);
    }
  }

  // User Profiles
  static async getUserProfile(userId: string): Promise<any | null> {
    try {
      return await cacheUtils.getWithFallback(
        CACHE_KEYS.USER_PROFILE(userId),
        () => Promise.resolve(null),
        CACHE_TTL.USER_PROFILE
      );
    } catch (error) {
      console.warn('Cache get profile error:', error);
      return null;
    }
  }

  static async setUserProfile(userId: string, profile: any): Promise<void> {
    await cacheUtils.set(
      CACHE_KEYS.USER_PROFILE(userId),
      profile,
      CACHE_TTL.USER_PROFILE
    );
  }

  // User Presence
  static async getUserPresence(userId: string): Promise<any | null> {
    try {
      return await cacheUtils.getWithFallback(
        CACHE_KEYS.USER_PRESENCE(userId),
        () => Promise.resolve(null),
        CACHE_TTL.USER_PRESENCE
      );
    } catch (error) {
      console.warn('Cache get presence error:', error);
      return null;
    }
  }

  static async setUserPresence(userId: string, presence: any): Promise<void> {
    await cacheUtils.set(
      CACHE_KEYS.USER_PRESENCE(userId),
      presence,
      CACHE_TTL.USER_PRESENCE
    );
  }

  // Network Connections
  static async getNetworkConnections(userId: string): Promise<any[] | null> {
    try {
      return await cacheUtils.getWithFallback(
        CACHE_KEYS.NETWORK_CONNECTIONS(userId),
        () => Promise.resolve([]),
        CACHE_TTL.NETWORK_CONNECTIONS
      );
    } catch (error) {
      console.warn('Cache get connections error:', error);
      return null;
    }
  }

  static async setNetworkConnections(userId: string, connections: any[]): Promise<void> {
    await cacheUtils.set(
      CACHE_KEYS.NETWORK_CONNECTIONS(userId),
      connections,
      CACHE_TTL.NETWORK_CONNECTIONS
    );
  }

  // Cache invalidation
  static async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      cacheUtils.del(CACHE_KEYS.USER_PROFILE(userId)),
      cacheUtils.del(CACHE_KEYS.USER_PRESENCE(userId)),
      cacheUtils.del(CACHE_KEYS.NETWORK_CONNECTIONS(userId)),
    ]);
  }

  static async invalidateChatCache(connectionId: string): Promise<void> {
    await Promise.all([
      cacheUtils.del(CACHE_KEYS.CHAT_MESSAGES(connectionId)),
      cacheUtils.del(CACHE_KEYS.CHAT_TYPING(connectionId)),
    ]);
  }
}