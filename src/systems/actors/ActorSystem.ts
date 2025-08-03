/**
 * Erlang-inspired Actor System for Chat and Mentorship Communication
 * Implements the actor model with message passing, fault tolerance, and supervision trees
 */

export interface ActorMessage {
  to: string;
  from: string;
  type: string;
  payload: any;
  timestamp: string;
  id: string;
}

export interface ActorState {
  id: string;
  type: string;
  status: 'active' | 'crashed' | 'restarting' | 'stopped';
  state: Record<string, any>;
  lastHeartbeat: string;
}

export abstract class Actor {
  public readonly id: string;
  public readonly type: string;
  protected state: Record<string, any> = {};
  protected mailbox: ActorMessage[] = [];
  protected supervisor?: Actor;
  protected children: Set<Actor> = new Set();
  protected isProcessing = false;
  protected status: 'active' | 'crashed' | 'restarting' | 'stopped' = 'active';

  constructor(id: string, type: string, supervisor?: Actor) {
    this.id = id;
    this.type = type;
    this.supervisor = supervisor;
    if (supervisor) {
      supervisor.addChild(this);
    }
  }

  abstract handle(message: ActorMessage): Promise<void>;

  async send(message: ActorMessage): Promise<void> {
    this.mailbox.push(message);
    if (!this.isProcessing) {
      await this.processMailbox();
    }
  }

  private async processMailbox(): Promise<void> {
    if (this.isProcessing || this.status !== 'active') return;
    
    this.isProcessing = true;
    
    try {
      while (this.mailbox.length > 0) {
        const message = this.mailbox.shift();
        if (message) {
          await this.handle(message);
        }
      }
    } catch (error) {
      console.error(`Actor ${this.id} crashed:`, error);
      await this.crash(error);
    } finally {
      this.isProcessing = false;
    }
  }

  protected async crash(error: any): Promise<void> {
    this.status = 'crashed';
    console.log(`Actor ${this.id} crashed, notifying supervisor...`);
    
    if (this.supervisor) {
      await this.supervisor.send({
        to: this.supervisor.id,
        from: this.id,
        type: 'child_crashed',
        payload: { error, actorId: this.id, actorType: this.type },
        timestamp: new Date().toISOString(),
        id: `crash-${Date.now()}`
      });
    }
  }

  protected addChild(child: Actor): void {
    this.children.add(child);
  }

  protected removeChild(child: Actor): void {
    this.children.delete(child);
  }

  async restart(): Promise<void> {
    console.log(`Restarting actor ${this.id}...`);
    this.status = 'restarting';
    this.mailbox = [];
    this.state = {};
    this.status = 'active';
    await this.onRestart();
  }

  protected async onRestart(): Promise<void> {
    // Override in subclasses for restart logic
  }

  getState(): ActorState {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      state: this.state,
      lastHeartbeat: new Date().toISOString()
    };
  }

  stop(): void {
    this.status = 'stopped';
    this.children.forEach(child => child.stop());
  }
}

export class ActorRegistry {
  private static instance: ActorRegistry;
  private actors: Map<string, Actor> = new Map();

  static getInstance(): ActorRegistry {
    if (!ActorRegistry.instance) {
      ActorRegistry.instance = new ActorRegistry();
    }
    return ActorRegistry.instance;
  }

  register(actor: Actor): void {
    this.actors.set(actor.id, actor);
  }

  unregister(actorId: string): void {
    this.actors.delete(actorId);
  }

  get(actorId: string): Actor | undefined {
    return this.actors.get(actorId);
  }

  async sendMessage(message: ActorMessage): Promise<boolean> {
    const actor = this.actors.get(message.to);
    if (actor) {
      await actor.send(message);
      return true;
    }
    console.warn(`Actor ${message.to} not found`);
    return false;
  }

  getAllActors(): Actor[] {
    return Array.from(this.actors.values());
  }

  getActorsByType(type: string): Actor[] {
    return Array.from(this.actors.values()).filter(actor => actor.type === type);
  }
}

export class MessageRouter {
  private static instance: MessageRouter;
  private registry: ActorRegistry;

  private constructor() {
    this.registry = ActorRegistry.getInstance();
  }

  static getInstance(): MessageRouter {
    if (!MessageRouter.instance) {
      MessageRouter.instance = new MessageRouter();
    }
    return MessageRouter.instance;
  }

  async route(message: ActorMessage): Promise<boolean> {
    // Route to specific actor
    if (message.to) {
      return await this.registry.sendMessage(message);
    }

    // Broadcast to all actors of a type
    if (message.type.startsWith('broadcast_')) {
      const targetType = message.type.replace('broadcast_', '');
      const actors = this.registry.getActorsByType(targetType);
      
      const promises = actors.map(actor => 
        actor.send({ ...message, to: actor.id })
      );
      
      await Promise.all(promises);
      return true;
    }

    return false;
  }

  createMessage(to: string, from: string, type: string, payload: any): ActorMessage {
    return {
      to,
      from,
      type,
      payload,
      timestamp: new Date().toISOString(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }
}