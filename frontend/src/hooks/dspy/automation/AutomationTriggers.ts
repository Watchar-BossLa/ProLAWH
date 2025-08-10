/**
 * Automated Optimization Triggers for DSPy Modules
 * Monitors performance and triggers optimizations based on thresholds
 */

import { DSPyService } from '../DSPyService';
import { DSPyMonitoringService } from '../monitoring/DSPyMonitoringService';
import { PerformanceBenchmark } from '../performance/PerformanceBenchmark';

interface TriggerConfig {
  name: string;
  enabled: boolean;
  conditions: Array<{
    metric: string;
    threshold: number;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    duration?: number; // seconds
  }>;
  actions: Array<{
    type: 'optimize_module' | 'run_benchmark' | 'alert' | 'rollback';
    parameters: Record<string, any>;
  }>;
  cooldown: number; // seconds
}

interface TriggerExecution {
  triggerId: string;
  timestamp: Date;
  conditions: string[];
  actionsExecuted: string[];
  success: boolean;
  error?: string;
}

export class AutomationTriggers {
  private triggers: Map<string, TriggerConfig> = new Map();
  private lastExecution: Map<string, Date> = new Map();
  private executions: TriggerExecution[] = [];
  private monitoring: DSPyMonitoringService;
  private dspyService: DSPyService;
  private benchmark: PerformanceBenchmark;
  private isRunning: boolean = false;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    dspyService: DSPyService,
    monitoring: DSPyMonitoringService,
    benchmark: PerformanceBenchmark
  ) {
    this.dspyService = dspyService;
    this.monitoring = monitoring;
    this.benchmark = benchmark;
    this.setupDefaultTriggers();
  }

  start(checkInterval: number = 60000): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.checkTriggers();
    }, checkInterval);
    
    console.log('Automation triggers started');
  }

  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    console.log('Automation triggers stopped');
  }

  addTrigger(config: TriggerConfig): void {
    this.triggers.set(config.name, config);
    console.log(`Added trigger: ${config.name}`);
  }

  removeTrigger(name: string): void {
    this.triggers.delete(name);
    this.lastExecution.delete(name);
    console.log(`Removed trigger: ${name}`);
  }

  enableTrigger(name: string): void {
    const trigger = this.triggers.get(name);
    if (trigger) {
      trigger.enabled = true;
      console.log(`Enabled trigger: ${name}`);
    }
  }

  disableTrigger(name: string): void {
    const trigger = this.triggers.get(name);
    if (trigger) {
      trigger.enabled = false;
      console.log(`Disabled trigger: ${name}`);
    }
  }

  private async checkTriggers(): Promise<void> {
    try {
      const currentMetrics = await this.monitoring.getAllModulesMetrics();
      
      for (const [name, trigger] of this.triggers.entries()) {
        if (!trigger.enabled) continue;
        
        // Check cooldown
        const lastExec = this.lastExecution.get(name);
        if (lastExec && (Date.now() - lastExec.getTime()) < trigger.cooldown * 1000) {
          continue;
        }
        
        // Check conditions
        const metConditions = await this.checkConditions(trigger.conditions, currentMetrics);
        
        if (metConditions.length > 0) {
          await this.executeTrigger(name, trigger, metConditions);
        }
      }
    } catch (error) {
      console.error('Error checking automation triggers:', error);
    }
  }

  private async checkConditions(
    conditions: TriggerConfig['conditions'],
    metrics: any[]
  ): Promise<string[]> {
    const metConditions: string[] = [];
    
    for (const condition of conditions) {
      const metricValue = this.extractMetricValue(metrics, condition.metric);
      if (metricValue === undefined) continue;
      
      const isMet = this.evaluateCondition(metricValue, condition.threshold, condition.operator);
      
      if (isMet) {
        metConditions.push(`${condition.metric} ${condition.operator} ${condition.threshold} (current: ${metricValue})`);
      }
    }
    
    return metConditions;
  }

  private extractMetricValue(metrics: any[], metricName: string): number | undefined {
    // Extract metric value from monitoring data
    for (const moduleMetrics of metrics) {
      if (moduleMetrics[metricName] !== undefined) {
        return typeof moduleMetrics[metricName] === 'number' 
          ? moduleMetrics[metricName] 
          : parseFloat(moduleMetrics[metricName]);
      }
    }
    return undefined;
  }

  private evaluateCondition(value: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'eq': return value === threshold;
      case 'gte': return value >= threshold;
      case 'lte': return value <= threshold;
      default: return false;
    }
  }

  private async executeTrigger(
    name: string,
    trigger: TriggerConfig,
    metConditions: string[]
  ): Promise<void> {
    console.log(`Executing trigger: ${name}`);
    console.log(`Met conditions: ${metConditions.join(', ')}`);
    
    const execution: TriggerExecution = {
      triggerId: name,
      timestamp: new Date(),
      conditions: metConditions,
      actionsExecuted: [],
      success: false
    };

    try {
      for (const action of trigger.actions) {
        await this.executeAction(action, execution);
      }
      
      execution.success = true;
      this.lastExecution.set(name, new Date());
    } catch (error) {
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Trigger execution failed: ${name}`, error);
    }
    
    this.executions.push(execution);
    
    // Keep only last 100 executions
    if (this.executions.length > 100) {
      this.executions.shift();
    }
  }

  private async executeAction(
    action: TriggerConfig['actions'][0],
    execution: TriggerExecution
  ): Promise<void> {
    console.log(`Executing action: ${action.type}`);
    
    switch (action.type) {
      case 'optimize_module':
        await this.optimizeModule(action.parameters);
        execution.actionsExecuted.push(`optimize_module:${action.parameters.module}`);
        break;
        
      case 'run_benchmark':
        await this.runBenchmark(action.parameters);
        execution.actionsExecuted.push(`run_benchmark:${action.parameters.config}`);
        break;
        
      case 'alert':
        await this.sendAlert(action.parameters);
        execution.actionsExecuted.push(`alert:${action.parameters.severity}`);
        break;
        
      case 'rollback':
        await this.rollbackModule(action.parameters);
        execution.actionsExecuted.push(`rollback:${action.parameters.module}`);
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async optimizeModule(parameters: Record<string, any>): Promise<void> {
    const moduleName = parameters.module as 'reasoning' | 'career_advice' | 'swarm_intelligence';
    if (!moduleName) throw new Error('Module name required for optimization');
    
    console.log(`Auto-optimizing module: ${moduleName}`);
    await this.dspyService.optimizeModule(moduleName);
  }

  private async runBenchmark(parameters: Record<string, any>): Promise<void> {
    const configName = parameters.config as string;
    if (!configName) throw new Error('Benchmark config name required');
    
    console.log(`Running benchmark: ${configName}`);
    // Implementation depends on how benchmark integrates with DSPy service
  }

  private async sendAlert(parameters: Record<string, any>): Promise<void> {
    const severity = parameters.severity || 'medium';
    const message = parameters.message || 'Automated trigger alert';
    
    console.log(`ALERT [${severity}]: ${message}`);
    
    // In production, integrate with alerting system (email, Slack, etc.)
    await this.monitoring.createAlert({
      severity,
      message,
      source: 'automation_trigger',
      timestamp: new Date()
    });
  }

  private async rollbackModule(parameters: Record<string, any>): Promise<void> {
    const moduleName = parameters.module as string;
    if (!moduleName) throw new Error('Module name required for rollback');
    
    console.log(`Rolling back module: ${moduleName}`);
    // Implementation for module rollback
    // This would restore previous working configuration
  }

  private setupDefaultTriggers(): void {
    // Performance degradation trigger
    this.addTrigger({
      name: 'performance_degradation',
      enabled: true,
      conditions: [
        { metric: 'average_latency', threshold: 5000, operator: 'gt' },
        { metric: 'error_rate', threshold: 0.1, operator: 'gt' }
      ],
      actions: [
        { type: 'alert', parameters: { severity: 'high', message: 'Performance degradation detected' } },
        { type: 'run_benchmark', parameters: { config: 'performance_regression' } }
      ],
      cooldown: 300 // 5 minutes
    });

    // Quality degradation trigger
    this.addTrigger({
      name: 'quality_degradation',
      enabled: true,
      conditions: [
        { metric: 'quality_score', threshold: 0.7, operator: 'lt' },
        { metric: 'confidence_score', threshold: 0.6, operator: 'lt' }
      ],
      actions: [
        { type: 'optimize_module', parameters: { module: 'reasoning' } },
        { type: 'alert', parameters: { severity: 'medium', message: 'Quality degradation - triggering optimization' } }
      ],
      cooldown: 1800 // 30 minutes
    });

    // High error rate trigger
    this.addTrigger({
      name: 'high_error_rate',
      enabled: true,
      conditions: [
        { metric: 'error_rate', threshold: 0.15, operator: 'gt' }
      ],
      actions: [
        { type: 'alert', parameters: { severity: 'critical', message: 'Critical error rate detected' } }
      ],
      cooldown: 120 // 2 minutes
    });

    // Weekly optimization trigger
    this.addTrigger({
      name: 'weekly_optimization',
      enabled: true,
      conditions: [
        { metric: 'hours_since_last_optimization', threshold: 168, operator: 'gt' } // 1 week
      ],
      actions: [
        { type: 'optimize_module', parameters: { module: 'career_advice' } },
        { type: 'run_benchmark', parameters: { config: 'weekly_regression' } }
      ],
      cooldown: 86400 // 24 hours
    });
  }

  // Public API methods
  getTriggers(): TriggerConfig[] {
    return Array.from(this.triggers.values());
  }

  getTriggerExecutions(triggerId?: string): TriggerExecution[] {
    if (triggerId) {
      return this.executions.filter(exec => exec.triggerId === triggerId);
    }
    return [...this.executions];
  }

  getStatus(): { running: boolean; activeTriggers: number; totalExecutions: number } {
    return {
      running: this.isRunning,
      activeTriggers: Array.from(this.triggers.values()).filter(t => t.enabled).length,
      totalExecutions: this.executions.length
    };
  }
}
