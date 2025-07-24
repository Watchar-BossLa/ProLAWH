import { useLLM } from '../useLLM';
import { DSPyLLMAdapter } from './core/DSPyLLMAdapter';
import { EnhancedReasoningChain } from './modules/EnhancedReasoningChain';
import { CareerAdviceModule } from './modules/CareerAdviceModule';
import { SwarmIntelligenceModule } from './modules/SwarmIntelligenceModule';
import { DSPyOptimizationResult, DSPyTrainingExample } from './types';

/**
 * Main DSPy Service - Integrates DSPy framework with existing agent system
 * Provides optimized, adaptive AI capabilities for all agent types
 */
export class DSPyService {
  private llmAdapter: DSPyLLMAdapter;
  private reasoningChainModule: EnhancedReasoningChain;
  private careerAdviceModule: CareerAdviceModule;
  private swarmIntelligenceModule: SwarmIntelligenceModule;
  
  private optimizationHistory: Map<string, DSPyOptimizationResult[]> = new Map();
  private isInitialized = false;

  constructor(llm: ReturnType<typeof useLLM>) {
    this.llmAdapter = new DSPyLLMAdapter(llm);
    this.initializeModules();
  }

  /**
   * Initialize DSPy modules
   */
  private initializeModules(): void {
    this.reasoningChainModule = new EnhancedReasoningChain(this.llmAdapter);
    this.careerAdviceModule = new CareerAdviceModule(this.llmAdapter);
    this.swarmIntelligenceModule = new SwarmIntelligenceModule(this.llmAdapter);
    
    // Generate initial training examples
    this.generateInitialTrainingData();
    this.isInitialized = true;
  }

  /**
   * Generate initial training data for modules
   */
  private generateInitialTrainingData(): void {
    // Career advice training examples
    this.careerAdviceModule.generateTrainingExamples();
    
    // Reasoning chain training examples
    const reasoningExamples: DSPyTrainingExample[] = [
      {
        inputs: {
          problem: "How to improve team productivity in a remote work environment",
          context: JSON.stringify({ team_size: 8, current_tools: ["Slack", "Zoom", "Trello"] }),
          agent_type: "productivity_advisor",
          domain_knowledge: "remote work best practices, team management"
        },
        outputs: {
          reasoning_steps: "1. Analyze current communication patterns\n2. Identify productivity bottlenecks\n3. Evaluate tool effectiveness\n4. Design improvement strategy",
          conclusion: "Implement structured daily standups and async communication protocols",
          confidence_score: "0.85",
          validation_criteria: "Measure productivity metrics before and after implementation"
        }
      }
    ];
    this.reasoningChainModule.addExamples(reasoningExamples);

    // Swarm coordination training examples
    const swarmExamples: DSPyTrainingExample[] = [
      {
        inputs: {
          task_description: "Develop comprehensive market analysis for new product launch",
          participating_agents: "market_researcher, competitor_analyst, trend_forecaster",
          coordination_strategy: "distributed",
          context: "Technology product, B2B market, 6-month timeline"
        },
        outputs: {
          coordination_plan: "Parallel research phases with weekly sync meetings and shared documentation",
          agent_assignments: "market_researcher: customer interviews\ncompetitor_analyst: competitive landscape\ntrend_forecaster: market trends and predictions",
          success_metrics: "Research completeness, insight quality, timeline adherence",
          monitoring_strategy: "Weekly progress reviews with milestone tracking"
        }
      }
    ];
    this.swarmIntelligenceModule.addExamples(swarmExamples);
  }

  /**
   * Get enhanced reasoning chain with DSPy optimization
   */
  async getEnhancedReasoningChain(
    agentId: string,
    problem: string,
    context: any,
    agentType: string = 'general'
  ) {
    this.ensureInitialized();
    
    const domainKnowledge = this.extractDomainKnowledge(agentType, context);
    return await this.reasoningChainModule.generateReasoningChain(
      agentId,
      problem,
      context,
      agentType,
      domainKnowledge
    );
  }

  /**
   * Get optimized career advice
   */
  async getCareerAdvice(
    userProfile: any,
    careerGoals: string,
    currentSkills: string[],
    additionalContext?: any
  ) {
    this.ensureInitialized();
    
    return await this.careerAdviceModule.generateAdvice(
      userProfile,
      careerGoals,
      currentSkills,
      additionalContext
    );
  }

  /**
   * Get optimized swarm coordination
   */
  async getSwarmCoordination(
    task: string,
    participatingAgents: string[],
    agentCapabilities: Record<string, string[]>,
    coordinationStrategy: 'hierarchical' | 'distributed' | 'consensus' = 'distributed',
    additionalContext?: any
  ) {
    this.ensureInitialized();
    
    return await this.swarmIntelligenceModule.createOptimizedCoordination(
      task,
      participatingAgents,
      agentCapabilities,
      coordinationStrategy,
      additionalContext
    );
  }

  /**
   * Optimize a specific module
   */
  async optimizeModule(
    moduleName: 'reasoning' | 'career_advice' | 'swarm_intelligence',
    customMetric?: (inputs: Record<string, any>, outputs: Record<string, any>) => number
  ): Promise<DSPyOptimizationResult> {
    this.ensureInitialized();
    
    let module;
    switch (moduleName) {
      case 'reasoning':
        module = this.reasoningChainModule;
        break;
      case 'career_advice':
        module = this.careerAdviceModule;
        break;
      case 'swarm_intelligence':
        module = this.swarmIntelligenceModule;
        break;
      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }

    const result = await module.optimize(customMetric);
    
    // Store optimization history
    const history = this.optimizationHistory.get(moduleName) || [];
    history.push(result);
    this.optimizationHistory.set(moduleName, history);
    
    console.log(`DSPy optimization completed for ${moduleName}:`, result);
    return result;
  }

  /**
   * Optimize all modules
   */
  async optimizeAllModules(): Promise<Record<string, DSPyOptimizationResult>> {
    this.ensureInitialized();
    
    const results: Record<string, DSPyOptimizationResult> = {};
    
    try {
      results.reasoning = await this.optimizeModule('reasoning');
      results.career_advice = await this.optimizeModule('career_advice');
      results.swarm_intelligence = await this.optimizeModule('swarm_intelligence');
      
      console.log('All DSPy modules optimized successfully:', results);
      return results;
    } catch (error) {
      console.error('Error optimizing DSPy modules:', error);
      throw error;
    }
  }

  /**
   * Add training example to a module
   */
  addTrainingExample(
    moduleName: 'reasoning' | 'career_advice' | 'swarm_intelligence',
    example: DSPyTrainingExample
  ): void {
    this.ensureInitialized();
    
    switch (moduleName) {
      case 'reasoning':
        this.reasoningChainModule.addExample(example);
        break;
      case 'career_advice':
        this.careerAdviceModule.addExample(example);
        break;
      case 'swarm_intelligence':
        this.swarmIntelligenceModule.addExample(example);
        break;
      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }
  }

  /**
   * Get optimization history for a module
   */
  getOptimizationHistory(moduleName: string): DSPyOptimizationResult[] {
    return this.optimizationHistory.get(moduleName) || [];
  }

  /**
   * Get performance metrics for all modules
   */
  getPerformanceMetrics(): Record<string, any> {
    this.ensureInitialized();
    
    return {
      reasoning: {
        examples_count: this.reasoningChainModule.examples.length,
        optimization_history: this.reasoningChainModule.getOptimizationHistory(),
        current_performance: this.getLatestPerformanceScore('reasoning')
      },
      career_advice: {
        examples_count: this.careerAdviceModule.examples.length,
        optimization_history: this.careerAdviceModule.getOptimizationHistory(),
        current_performance: this.getLatestPerformanceScore('career_advice')
      },
      swarm_intelligence: {
        examples_count: this.swarmIntelligenceModule.examples.length,
        optimization_history: this.swarmIntelligenceModule.getOptimizationHistory(),
        current_performance: this.getLatestPerformanceScore('swarm_intelligence')
      }
    };
  }

  /**
   * Extract domain knowledge based on agent type and context
   */
  private extractDomainKnowledge(agentType: string, context: any): string {
    const domainMap: Record<string, string> = {
      career_twin: "career development, professional growth, skill assessment",
      skill_advisor: "skill development, learning paths, competency frameworks",
      network_facilitator: "professional networking, relationship building, collaboration",
      opportunity_scout: "job market analysis, opportunity identification, career transitions",
      learning_coordinator: "educational content, learning methodologies, curriculum design",
      green_skills_specialist: "sustainability, environmental impact, green technologies"
    };

    let knowledge = domainMap[agentType] || "general problem solving, critical thinking";
    
    // Add context-specific knowledge
    if (context && typeof context === 'object') {
      const contextStr = JSON.stringify(context).toLowerCase();
      if (contextStr.includes('technical')) knowledge += ", technical expertise";
      if (contextStr.includes('leadership')) knowledge += ", leadership and management";
      if (contextStr.includes('strategy')) knowledge += ", strategic planning";
    }

    return knowledge;
  }

  /**
   * Get latest performance score for a module
   */
  private getLatestPerformanceScore(moduleName: string): number {
    const history = this.optimizationHistory.get(moduleName);
    if (!history || history.length === 0) return 0.7; // Default score
    
    return history[history.length - 1].performance_score;
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('DSPy Service not initialized. Please wait for initialization to complete.');
    }
  }

  /**
   * Reset all modules (useful for testing)
   */
  reset(): void {
    this.reasoningChainModule.reset();
    this.careerAdviceModule.reset();
    this.swarmIntelligenceModule.reset();
    this.optimizationHistory.clear();
    this.generateInitialTrainingData();
  }
}