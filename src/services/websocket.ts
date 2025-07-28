class WebSocketManager {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  updateToken(token: string) {
    this.token = token;
    this.connect();
  }

  private connect() {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }

      // Mock WebSocket connection for development
      // In a real app, this would connect to your WebSocket server
      console.log('WebSocket: Mock connection established');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`WebSocket: Reconnect attempt ${this.reconnectAttempts}`);
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('WebSocket: Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
    console.log('WebSocket: Disconnected');
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket: Cannot send message, connection not open');
    }
  }
}

const wsManager = new WebSocketManager();
export default wsManager;