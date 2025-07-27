
// Simple in-memory implementation of Google's Agent-to-Agent (A2A) protocol
// In a production system, this would be a separate service with persistence

export interface Message {
  id: string;
  from: string;
  to: string;
  content: any;
  timestamp: number;
}

type MessageHandler = (message: Message) => void;

export class A2AHub {
  private static instance: A2AHub;
  private agents: Set<string> = new Set();
  private handlers: Map<string, MessageHandler[]> = new Map();
  private messages: Message[] = [];
  
  private constructor() {}
  
  static getInstance(): A2AHub {
    if (!A2AHub.instance) {
      A2AHub.instance = new A2AHub();
    }
    return A2AHub.instance;
  }
  
  registerAgent(agentId: string): void {
    if (this.agents.has(agentId)) {
      console.warn(`Agent ${agentId} already registered`);
      return;
    }
    
    this.agents.add(agentId);
    this.handlers.set(agentId, []);
    console.log(`Agent ${agentId} registered with A2A hub`);
  }
  
  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
    this.handlers.delete(agentId);
    console.log(`Agent ${agentId} unregistered from A2A hub`);
  }
  
  addMessageHandler(agentId: string, handler: MessageHandler): () => void {
    if (!this.agents.has(agentId)) {
      this.registerAgent(agentId);
    }
    
    const agentHandlers = this.handlers.get(agentId) || [];
    agentHandlers.push(handler);
    this.handlers.set(agentId, agentHandlers);
    
    // Return function to remove this handler
    return () => {
      const handlers = this.handlers.get(agentId) || [];
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
        this.handlers.set(agentId, handlers);
      }
    };
  }
  
  sendMessage(from: string, to: string, content: any): string {
    if (!this.agents.has(from)) {
      throw new Error(`Sending agent ${from} is not registered`);
    }
    
    if (!this.agents.has(to)) {
      throw new Error(`Receiving agent ${to} is not registered`);
    }
    
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message: Message = {
      id: messageId,
      from,
      to,
      content,
      timestamp: Date.now()
    };
    
    this.messages.push(message);
    
    // Notify recipient handlers
    const handlers = this.handlers.get(to) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error(`Error in message handler for agent ${to}:`, error);
      }
    });
    
    return messageId;
  }
  
  getMessages(agentId: string, since?: number): Message[] {
    if (!this.agents.has(agentId)) {
      throw new Error(`Agent ${agentId} is not registered`);
    }
    
    const sinceTime = since || 0;
    
    return this.messages.filter(msg => {
      return (msg.to === agentId || msg.from === agentId) && msg.timestamp > sinceTime;
    });
  }
}
