import { DSPyBaseModule } from './DSPyBaseModule';
import { ReasoningChainSignature } from '../types';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';
import { AgentReasoningChain } from '../../types/enhancedAgenticTypes';

/**
 * DSPy-powered Enhanced Reasoning Chain Module
 * Replaces the static reasoning chain with adaptive, optimized reasoning
 */
export class EnhancedReasoningChain extends DSPyBaseModule {
  constructor(llmAdapter: DSPyLLMAdapter) {
    const signature: ReasoningChainSignature = {
      input_fields: {
        problem: "The problem or question to be solved",
        context: "Relevant context and background information",
        agent_type: "Type of agent performing the reasoning",
        domain_knowledge: "Relevant domain expertise and knowledge"
      },
      output_fields: {
        reasoning_steps: "Step-by-step reasoning process",
        conclusion: "Final conclusion or recommendation",
        confidence_score: "Confidence level (0-1) in the reasoning",
        validation_criteria: "Criteria for validating the reasoning"
      },
      instruction: `You are an advanced AI reasoning system. Analyze the given problem using systematic, evidence-based reasoning. 
      
Break down complex problems into logical steps, consider multiple perspectives, and provide well-reasoned conclusions with appropriate confidence levels.

Your reasoning should be:
1. Systematic and methodical
2. Evidence-based and logical
3. Transparent and explainable
4. Appropriately confident based on available evidence`
    };

    super('EnhancedReasoningChain', signature, llmAdapter, {
      temperature: 0.3, // Lower temperature for more consistent reasoning
      max_tokens: 1024,
    });
  }

  /**
   * Generate reasoning chain compatible with existing system
   */
  async generateReasoningChain(
    agentId: string,
    problem: string,
    context: any,
    agentType: string = 'general',
    domainKnowledge: string = ''
  ): Promise<AgentReasoningChain> {
    const inputs = {
      problem,
      context: JSON.stringify(context),
      agent_type: agentType,
      domain_knowledge: domainKnowledge
    };

    const result = await this.forward(inputs);

    // Parse reasoning steps
    const reasoningSteps = this.parseReasoningSteps(result.reasoning_steps);
    
    return {
      id: `reasoning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      agent_id: agentId,
      reasoning_steps: reasoningSteps,
      conclusion: {
        recommendation: result.conclusion,
        confidence_level: parseFloat(result.confidence_score) || 0.8,
        supporting_evidence: reasoningSteps.map(step => step.thought),
        validation_criteria: result.validation_criteria
      },
      confidence_score: parseFloat(result.confidence_score) || 0.8,
      validation_status: 'pending' as const
    };
  }

  /**
   * Parse reasoning steps from string format
   */
  private parseReasoningSteps(reasoningStepsStr: string): Array<{
    step: number;
    thought: string;
    evidence: any[];
    confidence: number;
    reasoning_type: 'logical' | 'probabilistic' | 'analogical' | 'causal';
  }> {
    const steps: Array<any> = [];
    const lines = reasoningStepsStr.split('\n').filter(line => line.trim());

    lines.forEach((line, index) => {
      if (line.trim()) {
        steps.push({
          step: index + 1,
          thought: line.replace(/^\d+\.?\s*/, '').trim(),
          evidence: [`step_${index + 1}_evidence`],
          confidence: 0.8 + (Math.random() * 0.15), // Random confidence between 0.8-0.95
          reasoning_type: this.inferReasoningType(line)
        });
      }
    });

    return steps.length > 0 ? steps : [{
      step: 1,
      thought: reasoningStepsStr,
      evidence: ['generated_reasoning'],
      confidence: 0.8,
      reasoning_type: 'logical' as const
    }];
  }

  /**
   * Infer reasoning type from step content
   */
  private inferReasoningType(stepText: string): 'logical' | 'probabilistic' | 'analogical' | 'causal' {
    const lowerText = stepText.toLowerCase();
    
    if (lowerText.includes('similar') || lowerText.includes('like') || lowerText.includes('analogy')) {
      return 'analogical';
    } else if (lowerText.includes('because') || lowerText.includes('causes') || lowerText.includes('leads to')) {
      return 'causal';
    } else if (lowerText.includes('likely') || lowerText.includes('probability') || lowerText.includes('chance')) {
      return 'probabilistic';
    } else {
      return 'logical';
    }
  }

  /**
   * Enhanced post-processing for reasoning chains
   */
  protected postProcess(result: Record<string, any>, inputs: Record<string, any>): Record<string, any> {
    return {
      ...result,
      confidence_score: this.normalizeConfidence(result.confidence_score),
      reasoning_metadata: {
        agent_type: inputs.agent_type,
        problem_complexity: this.assessComplexity(inputs.problem),
        reasoning_quality: this.assessReasoningQuality(result.reasoning_steps)
      }
    };
  }

  /**
   * Normalize confidence score to 0-1 range
   */
  private normalizeConfidence(confidenceStr: string): string {
    const confidence = parseFloat(confidenceStr) || 0.8;
    return Math.max(0, Math.min(1, confidence)).toString();
  }

  /**
   * Assess problem complexity
   */
  private assessComplexity(problem: string): 'low' | 'medium' | 'high' {
    const wordCount = problem.split(' ').length;
    if (wordCount < 10) return 'low';
    if (wordCount < 25) return 'medium';
    return 'high';
  }

  /**
   * Assess reasoning quality
   */
  private assessReasoningQuality(reasoningSteps: string): 'poor' | 'fair' | 'good' | 'excellent' {
    const stepCount = reasoningSteps.split('\n').filter(line => line.trim()).length;
    if (stepCount < 2) return 'poor';
    if (stepCount < 4) return 'fair';
    if (stepCount < 6) return 'good';
    return 'excellent';
  }
}