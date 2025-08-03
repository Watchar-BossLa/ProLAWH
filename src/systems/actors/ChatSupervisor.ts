/**
 * Chat Supervisor - Implements Erlang-style supervision tree for chat system
 * Manages chat room actors with fault tolerance and automatic restart capabilities
 */

import { Actor, ActorMessage, ActorRegistry, MessageRouter } from './ActorSystem';
import { ChatRoomActor } from './ChatRoomActor';

export interface SupervisorStrategy {
  type: 'one_for_one' | 'one_for_all' | 'rest_for_one';
  maxRestarts: number;
  withinTime: number; // milliseconds
}

export interface ChildSpec {
  id: string;
  type: 'chat_room' | 'mentorship_session' | 'connection_manager';
  restartCount: number;
  lastRestart: string;
  config: any;
}

export class ChatSupervisor extends Actor {
  private strategy: SupervisorStrategy;
  private childSpecs: Map<string, ChildSpec> = new Map();
  private registry: ActorRegistry;
  private messageRouter: MessageRouter;
  private monitoringInterval?: NodeJS.Timeout;

  constructor(
    id: string = 'chat-supervisor',
    strategy: SupervisorStrategy = {
      type: 'one_for_one',
      maxRestarts: 3,
      withinTime: 60000 // 1 minute
    }
  ) {
    super(id, 'supervisor');
    this.strategy = strategy;
    this.registry = ActorRegistry.getInstance();
    this.messageRouter = MessageRouter.getInstance();
    
    this.registry.register(this);
    this.startMonitoring();
    
    console.log(`Chat Supervisor started with strategy: ${strategy.type}`);
  }

  async handle(message: ActorMessage): Promise<void> {
    console.log(`Supervisor handling message: ${message.type}`);

    switch (message.type) {
      case 'start_chat_room':
        await this.handleStartChatRoom(message);
        break;
      case 'stop_chat_room':
        await this.handleStopChatRoom(message);
        break;
      case 'child_crashed':
        await this.handleChildCrashed(message);
        break;
      case 'health_check':
        await this.handleHealthCheck(message);
        break;
      case 'restart_child':
        await this.handleRestartChild(message);
        break;
      case 'get_supervisor_status':
        await this.handleGetSupervisorStatus(message);
        break;
      case 'shutdown_all':
        await this.handleShutdownAll(message);
        break;
      default:
        console.warn(`Supervisor: Unknown message type: ${message.type}`);
    }
  }

  private async handleStartChatRoom(message: ActorMessage): Promise<void> {
    const { roomId, config = {} } = message.payload;
    
    try {
      // Check if room already exists
      const existingRoom = this.registry.get(`chat-room-${roomId}`);
      if (existingRoom) {
        console.log(`Chat room ${roomId} already exists`);
        await this.sendResponse(message.from, 'chat_room_started', {
          roomId,
          actorId: existingRoom.id,
          status: 'existing'
        });
        return;
      }

      // Create new chat room actor
      const chatRoom = new ChatRoomActor(roomId, this);
      this.registry.register(chatRoom);

      // Add to child specs
      this.childSpecs.set(chatRoom.id, {
        id: chatRoom.id,
        type: 'chat_room',
        restartCount: 0,
        lastRestart: new Date().toISOString(),
        config: { roomId, ...config }
      });

      console.log(`Chat room ${roomId} started successfully`);

      // Send success response
      await this.sendResponse(message.from, 'chat_room_started', {
        roomId,
        actorId: chatRoom.id,
        status: 'created'
      });

    } catch (error) {
      console.error(`Failed to start chat room ${roomId}:`, error);
      
      await this.sendResponse(message.from, 'chat_room_error', {
        roomId,
        error: 'Failed to start chat room'
      });
    }
  }

  private async handleStopChatRoom(message: ActorMessage): Promise<void> {
    const { roomId } = message.payload;
    const actorId = `chat-room-${roomId}`;
    
    const actor = this.registry.get(actorId);
    if (actor) {
      actor.stop();
      this.registry.unregister(actorId);
      this.childSpecs.delete(actorId);
      
      console.log(`Chat room ${roomId} stopped`);
      
      await this.sendResponse(message.from, 'chat_room_stopped', {
        roomId,
        status: 'stopped'
      });
    } else {
      await this.sendResponse(message.from, 'chat_room_error', {
        roomId,
        error: 'Chat room not found'
      });
    }
  }

  private async handleChildCrashed(message: ActorMessage): Promise<void> {
    const { actorId, error, actorType } = message.payload;
    
    console.log(`Child actor crashed: ${actorId}, type: ${actorType}`);
    console.error('Crash details:', error);

    const childSpec = this.childSpecs.get(actorId);
    if (!childSpec) {
      console.warn(`No child spec found for crashed actor: ${actorId}`);
      return;
    }

    // Check restart limits
    const now = Date.now();
    const lastRestart = new Date(childSpec.lastRestart).getTime();
    const timeSinceLastRestart = now - lastRestart;

    if (timeSinceLastRestart < this.strategy.withinTime) {
      childSpec.restartCount++;
    } else {
      // Reset restart count if enough time has passed
      childSpec.restartCount = 1;
    }

    if (childSpec.restartCount > this.strategy.maxRestarts) {
      console.error(`Actor ${actorId} exceeded max restarts (${this.strategy.maxRestarts})`);
      
      // Apply supervision strategy
      await this.applySupervisionStrategy(actorId);
      return;
    }

    // Restart the child
    await this.restartChild(actorId, childSpec);
  }

  private async restartChild(actorId: string, childSpec: ChildSpec): Promise<void> {
    try {
      // Remove crashed actor
      this.registry.unregister(actorId);

      // Create new actor based on type
      let newActor: Actor;
      
      switch (childSpec.type) {
        case 'chat_room':
          const roomId = childSpec.config.roomId;
          newActor = new ChatRoomActor(roomId, this);
          break;
        default:
          throw new Error(`Unknown child type: ${childSpec.type}`);
      }

      // Register new actor
      this.registry.register(newActor);

      // Update child spec
      childSpec.lastRestart = new Date().toISOString();

      console.log(`Successfully restarted actor: ${actorId}`);

      // Notify about restart
      await this.messageRouter.route(
        this.messageRouter.createMessage(
          'system',
          this.id,
          'actor_restarted',
          { actorId, restartCount: childSpec.restartCount }
        )
      );

    } catch (error) {
      console.error(`Failed to restart actor ${actorId}:`, error);
      
      // If restart fails, apply supervision strategy
      await this.applySupervisionStrategy(actorId);
    }
  }

  private async applySupervisionStrategy(failedActorId: string): Promise<void> {
    console.log(`Applying supervision strategy: ${this.strategy.type} for ${failedActorId}`);

    switch (this.strategy.type) {
      case 'one_for_one':
        // Only restart the failed actor (already handled above if we reach here, it means permanent failure)
        console.log(`Permanently removing failed actor: ${failedActorId}`);
        this.childSpecs.delete(failedActorId);
        break;

      case 'one_for_all':
        // Restart all child actors
        console.log('Restarting all child actors due to supervision strategy');
        await this.restartAllChildren();
        break;

      case 'rest_for_one':
        // Restart the failed actor and all actors started after it
        console.log('Restarting failed actor and subsequent children');
        await this.restartChildrenAfter(failedActorId);
        break;
    }
  }

  private async restartAllChildren(): Promise<void> {
    const childrenToRestart = Array.from(this.childSpecs.entries());
    
    // Stop all children
    for (const [actorId] of childrenToRestart) {
      const actor = this.registry.get(actorId);
      if (actor) {
        actor.stop();
        this.registry.unregister(actorId);
      }
    }

    // Restart all children
    for (const [actorId, childSpec] of childrenToRestart) {
      await this.restartChild(actorId, childSpec);
    }
  }

  private async restartChildrenAfter(failedActorId: string): Promise<void> {
    // In a more complex system, we would track child start order
    // For now, just restart all children
    await this.restartAllChildren();
  }

  private async handleHealthCheck(message: ActorMessage): Promise<void> {
    const healthStatus = {
      supervisorId: this.id,
      status: this.status,
      childCount: this.childSpecs.size,
      children: Array.from(this.childSpecs.entries()).map(([id, spec]) => ({
        id,
        type: spec.type,
        restartCount: spec.restartCount,
        lastRestart: spec.lastRestart,
        status: this.registry.get(id)?.getState().status || 'unknown'
      })),
      strategy: this.strategy,
      timestamp: new Date().toISOString()
    };

    await this.sendResponse(message.from, 'health_check_response', healthStatus);
  }

  private async handleRestartChild(message: ActorMessage): Promise<void> {
    const { actorId } = message.payload;
    const childSpec = this.childSpecs.get(actorId);
    
    if (childSpec) {
      await this.restartChild(actorId, childSpec);
      await this.sendResponse(message.from, 'child_restarted', { actorId });
    } else {
      await this.sendResponse(message.from, 'restart_error', { 
        actorId, 
        error: 'Child not found' 
      });
    }
  }

  private async handleGetSupervisorStatus(message: ActorMessage): Promise<void> {
    const status = {
      id: this.id,
      strategy: this.strategy,
      childCount: this.childSpecs.size,
      children: Array.from(this.childSpecs.keys()),
      uptime: new Date().toISOString() // simplified
    };

    await this.sendResponse(message.from, 'supervisor_status', status);
  }

  private async handleShutdownAll(message: ActorMessage): Promise<void> {
    console.log('Supervisor: Shutting down all children');
    
    // Stop all children
    for (const [actorId] of this.childSpecs) {
      const actor = this.registry.get(actorId);
      if (actor) {
        actor.stop();
        this.registry.unregister(actorId);
      }
    }

    this.childSpecs.clear();
    
    await this.sendResponse(message.from, 'shutdown_complete', {
      supervisorId: this.id
    });
  }

  private async sendResponse(to: string, type: string, payload: any): Promise<void> {
    await this.messageRouter.route(
      this.messageRouter.createMessage(to, this.id, type, payload)
    );
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks();
    }, 60000); // Check every minute
  }

  private async performHealthChecks(): Promise<void> {
    // Check if children are still responding
    for (const [actorId, childSpec] of this.childSpecs) {
      const actor = this.registry.get(actorId);
      if (!actor || actor.getState().status === 'crashed') {
        console.log(`Detected unresponsive child: ${actorId}`);
        
        // Trigger restart
        await this.send({
          to: this.id,
          from: 'monitor',
          type: 'child_crashed',
          payload: {
            actorId,
            error: 'Health check failed',
            actorType: childSpec.type
          },
          timestamp: new Date().toISOString(),
          id: `health-check-${Date.now()}`
        });
      }
    }
  }

  stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Stop all children
    for (const [actorId] of this.childSpecs) {
      const actor = this.registry.get(actorId);
      if (actor) {
        actor.stop();
      }
    }

    super.stop();
  }

  // Public API methods
  async startChatRoom(roomId: string, config?: any): Promise<void> {
    await this.send({
      to: this.id,
      from: 'api',
      type: 'start_chat_room',
      payload: { roomId, config },
      timestamp: new Date().toISOString(),
      id: `start-room-${Date.now()}`
    });
  }

  async stopChatRoom(roomId: string): Promise<void> {
    await this.send({
      to: this.id,
      from: 'api',
      type: 'stop_chat_room',
      payload: { roomId },
      timestamp: new Date().toISOString(),
      id: `stop-room-${Date.now()}`
    });
  }

  getChildCount(): number {
    return this.childSpecs.size;
  }

  getChildrenStatus(): any[] {
    return Array.from(this.childSpecs.entries()).map(([id, spec]) => ({
      id,
      type: spec.type,
      restartCount: spec.restartCount,
      status: this.registry.get(id)?.getState().status || 'unknown'
    }));
  }
}