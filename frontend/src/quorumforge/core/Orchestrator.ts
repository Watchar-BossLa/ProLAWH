
import { throttle } from '../middleware/limits';
import { SeniorManagerGPT } from './SeniorManagerGPT';

interface OrchestrationTask {
  id: string;
  task: string;
  context: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class Orchestrator {
  private static instance: Orchestrator;
  private tasks: Map<string, OrchestrationTask> = new Map();
  private seniorManager: SeniorManagerGPT;
  
  private constructor() {
    this.seniorManager = SeniorManagerGPT.getInstance();
  }
  
  static getInstance(): Orchestrator {
    if (!Orchestrator.instance) {
      Orchestrator.instance = new Orchestrator();
    }
    return Orchestrator.instance;
  }
  
  async scheduleTask(task: string, context: Record<string, any> = {}): Promise<string> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.tasks.set(taskId, {
      id: taskId,
      task,
      context,
      status: 'pending'
    });
    
    // Start processing in background
    this.processTasks();
    
    return taskId;
  }
  
  getTaskStatus(taskId: string): OrchestrationTask | undefined {
    return this.tasks.get(taskId);
  }
  
  private async processTasks() {
    // Find pending tasks
    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'pending') {
        task.status = 'processing';
        
        try {
          await throttle('orchestrator');
          
          // Delegate to appropriate council
          const councilType = await this.seniorManager.delegateToCouncil(task.task, task.context);
          
          // In real implementation, this would create and run councils
          // For now, simulate with a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          task.result = {
            councilType,
            simulatedResult: 'Task processed successfully',
            timestamp: new Date().toISOString()
          };
          
          task.status = 'completed';
        } catch (error) {
          task.status = 'failed';
          task.error = error instanceof Error ? error.message : String(error);
        }
      }
    }
  }
}
