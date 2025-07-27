import { apiClient } from './api';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface WebSocketCallbacks {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.token = localStorage.getItem('prolawh_token');
  }

  connect(callbacks: WebSocketCallbacks = {}) {
    if (!this.token) {
      console.error('No auth token available for WebSocket connection');
      return;
    }

    this.callbacks = callbacks;
    
    const wsUrl = `ws://localhost:8001/ws/chat/${this.token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.callbacks.onConnect?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.callbacks.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.callbacks.onDisconnect?.();
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.callbacks.onError?.(error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinChat(chatId: string) {
    this.sendMessage({
      type: 'join_chat',
      chat_id: chatId,
    });
  }

  leaveChat(chatId: string) {
    this.sendMessage({
      type: 'leave_chat',
      chat_id: chatId,
    });
  }

  sendChatMessage(chatId: string, content: string, messageType = 'text', replyTo?: string) {
    this.sendMessage({
      type: 'send_message',
      chat_id: chatId,
      content,
      message_type: messageType,
      reply_to: replyTo,
    });
  }

  sendTypingIndicator(chatId: string, isTyping: boolean) {
    this.sendMessage({
      type: 'typing',
      chat_id: chatId,
      is_typing: isTyping,
    });
  }

  markMessagesAsRead(chatId: string, messageIds: string[]) {
    this.sendMessage({
      type: 'mark_read',
      chat_id: chatId,
      message_ids: messageIds,
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(this.callbacks);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  updateToken(token: string) {
    this.token = token;
    localStorage.setItem('prolawh_token', token);
    
    // Reconnect with new token if currently connected
    if (this.ws) {
      this.disconnect();
      this.connect(this.callbacks);
    }
  }
}

export const wsManager = new WebSocketManager();
export default wsManager;