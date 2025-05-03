
export interface SwarmTask<T, R> {
  task: T;
  result?: R;
  error?: Error;
}

export class SwarmWrapper {
  private concurrency: number;
  
  constructor(concurrency: number = 4) {
    this.concurrency = concurrency;
  }
  
  async run<T, R>(
    tasks: SwarmTask<T, R>[],
    processor: (task: T) => Promise<R>
  ): Promise<SwarmTask<T, R>[]> {
    // Track metrics
    const startTime = Date.now();
    const metrics = {
      tasksTotal: tasks.length,
      tasksCompleted: 0,
      tasksFailed: 0,
      fanout: Math.min(tasks.length, this.concurrency)
    };
    
    console.log(`Starting swarm execution with ${metrics.fanout} parallel workers`);
    
    // Process tasks in batches according to concurrency
    const results = [...tasks]; // Clone to preserve order
    
    for (let i = 0; i < tasks.length; i += this.concurrency) {
      const batch = tasks.slice(i, i + this.concurrency);
      const promises = batch.map(async (task, index) => {
        const batchIndex = i + index;
        
        try {
          const result = await processor(task.task);
          results[batchIndex].result = result;
          metrics.tasksCompleted++;
          return result;
        } catch (error) {
          results[batchIndex].error = error instanceof Error ? error : new Error(String(error));
          metrics.tasksFailed++;
          throw error;
        }
      });
      
      // Wait for current batch to complete before starting next
      await Promise.allSettled(promises);
    }
    
    // Log metrics
    const duration = Date.now() - startTime;
    console.log(`Swarm execution completed in ${duration}ms: ${metrics.tasksCompleted} succeeded, ${metrics.tasksFailed} failed`);
    
    // In a production implementation, these metrics would be pushed to Redis/Prometheus
    
    return results;
  }
}

// Helper function for easier usage
export async function runSwarm<T, R>(
  tasks: T[],
  processor: (task: T) => Promise<R>,
  concurrency: number = 4
): Promise<(R | Error)[]> {
  const wrapper = new SwarmWrapper(concurrency);
  const swarmTasks = tasks.map(task => ({ task }));
  
  const results = await wrapper.run(swarmTasks, processor);
  
  return results.map(task => {
    if (task.error) {
      return task.error;
    }
    return task.result as R;
  });
}
