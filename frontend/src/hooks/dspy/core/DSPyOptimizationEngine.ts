import { supabase } from '@/integrations/supabase/client';
import { DSPyLLMAdapter, DSPyOptimizationResult } from './DSPyLLMAdapter';
import { DSPyTrainingExample } from '../types';

export interface OptimizationConfig {
  max_iterations: number;
  target_score: number;
  min_examples: number;
  ensemble_size: number;
  bootstrap_samples: number;
}

export interface OptimizationReport {
  module_name: string;
  optimization_id: string;
  start_time: Date;
  end_time: Date;
  initial_score: number;
  final_score: number;
  improvement: number;
  iterations_completed: number;
  total_examples_used: number;
  best_prompts: string[];
  performance_metrics: Record<string, any>;
}

/**
 * Production-grade DSPy Optimization Engine
 * Implements MIPRO, Bootstrap Few-Shot, and Ensemble Methods
 */
export class DSPyOptimizationEngine {
  private adapter: DSPyLLMAdapter;
  private defaultConfig: OptimizationConfig = {
    max_iterations: 10,
    target_score: 0.85,
    min_examples: 5,
    ensemble_size: 3,
    bootstrap_samples: 20
  };

  constructor(adapter: DSPyLLMAdapter) {
    this.adapter = adapter;
  }

  /**
   * MIPRO: Multi-prompt Instruction Proposal and Refinement Optimization
   */
  async optimizeWithMIPRO(
    moduleName: string,
    signature: any,
    trainingExamples: DSPyTrainingExample[],
    config: Partial<OptimizationConfig> = {}
  ): Promise<OptimizationReport> {
    const optimizationConfig = { ...this.defaultConfig, ...config };
    const startTime = new Date();
    const optimizationId = `mipro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Starting MIPRO optimization for ${moduleName} with ${trainingExamples.length} examples`);

    // Validate minimum examples
    if (trainingExamples.length < optimizationConfig.min_examples) {
      throw new Error(`Insufficient training examples. Need at least ${optimizationConfig.min_examples}, got ${trainingExamples.length}`);
    }

    // Initial baseline performance
    const initialScore = await this.evaluateSignature(signature, trainingExamples.slice(0, 5));
    
    let bestSignature = { ...signature };
    let bestScore = initialScore;
    let iterationResults: Array<{ prompt: string; score: number }> = [];

    // MIPRO Optimization Loop
    for (let iteration = 0; iteration < optimizationConfig.max_iterations; iteration++) {
      console.log(`MIPRO iteration ${iteration + 1}/${optimizationConfig.max_iterations}`);

      // Generate candidate prompts using different strategies
      const candidates = await this.generateMIPROCandidates(bestSignature, trainingExamples, iteration);
      
      // Evaluate each candidate
      for (const candidate of candidates) {
        const candidateSignature = { ...signature, instruction: candidate };
        const score = await this.evaluateSignature(candidateSignature, trainingExamples);
        
        iterationResults.push({ prompt: candidate, score });
        
        if (score > bestScore) {
          bestScore = score;
          bestSignature = candidateSignature;
          
          console.log(`New best score: ${score.toFixed(3)} (iteration ${iteration + 1})`);
        }
        
        // Early stopping if target reached
        if (score >= optimizationConfig.target_score) {
          console.log(`Target score ${optimizationConfig.target_score} reached!`);
          break;
        }
      }
      
      if (bestScore >= optimizationConfig.target_score) {
        break;
      }
    }

    const endTime = new Date();
    const report: OptimizationReport = {
      module_name: moduleName,
      optimization_id: optimizationId,
      start_time: startTime,
      end_time: endTime,
      initial_score: initialScore,
      final_score: bestScore,
      improvement: bestScore - initialScore,
      iterations_completed: Math.min(optimizationConfig.max_iterations, iterationResults.length),
      total_examples_used: trainingExamples.length,
      best_prompts: iterationResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(r => r.prompt),
      performance_metrics: {
        optimization_time_ms: endTime.getTime() - startTime.getTime(),
        prompts_tested: iterationResults.length,
        success_rate: iterationResults.filter(r => r.score > initialScore).length / iterationResults.length
      }
    };

    // Save optimization results
    await this.saveOptimizationResults(report, bestSignature.instruction);
    
    return report;
  }

  /**
   * Bootstrap Few-Shot Learning Implementation
   */
  async bootstrapFewShot(
    moduleName: string,
    signature: any,
    trainingExamples: DSPyTrainingExample[],
    config: Partial<OptimizationConfig> = {}
  ): Promise<{ optimizedSignature: any; examples: DSPyTrainingExample[] }> {
    const optimizationConfig = { ...this.defaultConfig, ...config };
    
    console.log(`Starting Bootstrap Few-Shot for ${moduleName}`);

    let bestExamples = trainingExamples.slice(0, optimizationConfig.min_examples);
    let bestScore = await this.evaluateSignature(signature, bestExamples);

    // Bootstrap sampling
    for (let i = 0; i < optimizationConfig.bootstrap_samples; i++) {
      // Sample with replacement
      const sampledExamples = this.bootstrapSample(trainingExamples, optimizationConfig.min_examples * 2);
      
      // Test performance with this sample
      const score = await this.evaluateSignature(signature, sampledExamples);
      
      if (score > bestScore) {
        bestScore = score;
        bestExamples = sampledExamples;
      }
    }

    console.log(`Bootstrap Few-Shot completed. Best score: ${bestScore.toFixed(3)}`);

    return {
      optimizedSignature: signature,
      examples: bestExamples
    };
  }

  /**
   * Ensemble Methods for Multi-Agent Coordination
   */
  async createEnsemble(
    moduleName: string,
    signatures: any[],
    trainingExamples: DSPyTrainingExample[],
    config: Partial<OptimizationConfig> = {}
  ): Promise<{ ensembleSignatures: any[]; weights: number[] }> {
    const optimizationConfig = { ...this.defaultConfig, ...config };
    
    console.log(`Creating ensemble for ${moduleName} with ${signatures.length} signatures`);

    // Evaluate each signature
    const scores = await Promise.all(
      signatures.map(sig => this.evaluateSignature(sig, trainingExamples))
    );

    // Calculate ensemble weights based on performance
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const weights = scores.map(score => totalScore > 0 ? score / totalScore : 1 / signatures.length);

    // Select top performers for ensemble
    const sortedIndices = scores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, optimizationConfig.ensemble_size)
      .map(item => item.index);

    const ensembleSignatures = sortedIndices.map(i => signatures[i]);
    const ensembleWeights = sortedIndices.map(i => weights[i]);

    console.log(`Ensemble created with ${ensembleSignatures.length} signatures`);

    return {
      ensembleSignatures,
      weights: ensembleWeights
    };
  }

  private async generateMIPROCandidates(
    baseSignature: any,
    trainingExamples: DSPyTrainingExample[],
    iteration: number
  ): Promise<string[]> {
    const strategies = [
      'Make this instruction more specific and detailed',
      'Simplify this instruction for better clarity',
      'Add examples to this instruction for better understanding',
      'Optimize this instruction for accuracy and precision',
      'Rewrite this instruction to be more actionable'
    ];

    const candidates: string[] = [];
    const strategy = strategies[iteration % strategies.length];
    
    // Use few-shot examples to improve prompt generation
    const exampleContext = trainingExamples.slice(0, 3)
      .map(ex => `Input: ${JSON.stringify(ex.inputs)}\nExpected: ${JSON.stringify(ex.outputs)}`)
      .join('\n\n');

    const metaPrompt = `
${strategy}: "${baseSignature.instruction}"

Context: This instruction will be used with inputs/outputs like these examples:
${exampleContext}

Generate 3 improved versions of the instruction that will perform better on similar tasks.
Focus on clarity, specificity, and actionable guidance.

Improved instructions:
1.`;

    try {
      const response = await this.adapter.generate({ 
        prompt: metaPrompt,
        cache_key: `mipro_candidate_${iteration}`
      });
      
      // Parse multiple candidates from response
      const lines = response.text.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const match = line.match(/^\d+\.\s*(.+)$/);
        if (match && match[1].length > 20) {
          candidates.push(match[1].trim());
        }
      }
    } catch (error) {
      console.warn('Failed to generate MIPRO candidates:', error);
    }

    // Fallback: return the original instruction if no candidates generated
    return candidates.length > 0 ? candidates : [baseSignature.instruction];
  }

  private async evaluateSignature(
    signature: any,
    examples: DSPyTrainingExample[]
  ): Promise<number> {
    const scores: number[] = [];
    
    for (const example of examples) {
      try {
        const result = await this.adapter.executeSignature(signature, example.inputs);
        const score = this.calculateExampleScore(result, example.outputs);
        scores.push(score);
      } catch (error) {
        scores.push(0);
      }
    }
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  private calculateExampleScore(actual: Record<string, any>, expected: Record<string, any>): number {
    let totalScore = 0;
    let fieldCount = 0;

    for (const [key, expectedValue] of Object.entries(expected)) {
      if (key.startsWith('_')) continue;
      
      fieldCount++;
      const actualValue = actual[key];
      
      if (typeof expectedValue === 'string' && typeof actualValue === 'string') {
        totalScore += this.textSimilarity(actualValue, expectedValue);
      } else if (expectedValue === actualValue) {
        totalScore += 1;
      } else if (typeof expectedValue === 'number' && typeof actualValue === 'number') {
        const diff = Math.abs(expectedValue - actualValue);
        const maxVal = Math.max(Math.abs(expectedValue), Math.abs(actualValue), 1);
        totalScore += Math.max(0, 1 - (diff / maxVal));
      }
    }

    return fieldCount > 0 ? totalScore / fieldCount : 0;
  }

  private textSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private bootstrapSample<T>(array: T[], size: number): T[] {
    const sample: T[] = [];
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * array.length);
      sample.push(array[randomIndex]);
    }
    return sample;
  }

  private async saveOptimizationResults(
    report: OptimizationReport,
    bestPrompt: string
  ): Promise<void> {
    try {
      await supabase.from('dspy_optimization_history').insert({
        module_name: report.module_name,
        optimization_run_id: report.optimization_id,
        prompt_variations: report.best_prompts,
        best_prompt: bestPrompt,
        performance_score: report.final_score,
        optimization_metrics: {
          ...report.performance_metrics,
          initial_score: report.initial_score,
          improvement: report.improvement,
          iterations: report.iterations_completed
        },
        training_examples_count: report.total_examples_used,
        optimization_duration_ms: report.performance_metrics.optimization_time_ms
      });

      console.log(`Optimization results saved for ${report.module_name}`);
    } catch (error) {
      console.error('Failed to save optimization results:', error);
    }
  }
}