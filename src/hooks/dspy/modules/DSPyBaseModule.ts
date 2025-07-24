import { DSPyModule, DSPySignature, DSPyTrainingExample, DSPyOptimizationResult } from '../types';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';

/**
 * Base DSPy Module class - Foundation for all DSPy-powered agent modules
 * Implements core DSPy functionality including signature execution, optimization, and learning
 */
export abstract class DSPyBaseModule implements DSPyModule {
  public name: string;
  public signature: DSPySignature;
  public examples: DSPyTrainingExample[];
  public config: any;
  
  protected llmAdapter: DSPyLLMAdapter;
  protected optimizationHistory: DSPyOptimizationResult[] = [];

  constructor(
    name: string,
    signature: DSPySignature,
    llmAdapter: DSPyLLMAdapter,
    config?: any
  ) {
    this.name = name;
    this.signature = signature;
    this.llmAdapter = llmAdapter;
    this.examples = [];
    this.config = {
      temperature: 0.7,
      max_tokens: 512,
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      ...config
    };
  }

  /**
   * Execute the module with given inputs
   */
  async forward(inputs: Record<string, any>): Promise<Record<string, any>> {
    try {
      // Validate inputs
      this.validateInputs(inputs);

      // Execute signature
      const result = await this.llmAdapter.executeSignature(this.signature, inputs);

      // Post-process result
      return this.postProcess(result, inputs);
    } catch (error) {
      console.error(`DSPy Module ${this.name} execution error:`, error);
      throw error;
    }
  }

  /**
   * Add training example for optimization
   */
  addExample(example: DSPyTrainingExample): void {
    this.examples.push(example);
  }

  /**
   * Add multiple training examples
   */
  addExamples(examples: DSPyTrainingExample[]): void {
    this.examples.push(...examples);
  }

  /**
   * Optimize the module using DSPy optimization techniques
   */
  async optimize(metric?: (inputs: Record<string, any>, outputs: Record<string, any>) => number): Promise<DSPyOptimizationResult> {
    if (this.examples.length === 0) {
      throw new Error('No training examples provided for optimization');
    }

    console.log(`Optimizing DSPy module: ${this.name} with ${this.examples.length} examples`);

    // Simple optimization: test different prompts and select best performing
    const optimizationResults: Array<{ prompt: string; score: number }> = [];

    // Generate prompt variations
    const promptVariations = this.generatePromptVariations();

    for (const promptVariation of promptVariations) {
      let totalScore = 0;
      let validExamples = 0;

      // Test on training examples
      for (const example of this.examples) {
        try {
          const tempSignature = { ...this.signature, instruction: promptVariation };
          const result = await this.llmAdapter.executeSignature(tempSignature, example.inputs);
          
          if (metric) {
            totalScore += metric(example.inputs, result);
          } else {
            totalScore += this.defaultMetric(example.outputs, result);
          }
          validExamples++;
        } catch (error) {
          console.warn(`Error testing prompt variation:`, error);
        }
      }

      if (validExamples > 0) {
        optimizationResults.push({
          prompt: promptVariation,
          score: totalScore / validExamples
        });
      }
    }

    // Select best performing prompt
    const bestResult = optimizationResults.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    // Update signature with optimized prompt
    this.signature.instruction = bestResult.prompt;

    const optimizationResult: DSPyOptimizationResult = {
      optimized_prompts: [bestResult.prompt],
      performance_score: bestResult.score,
      optimization_metrics: {
        accuracy: bestResult.score,
        consistency: this.calculateConsistency(),
        response_quality: bestResult.score
      }
    };

    this.optimizationHistory.push(optimizationResult);
    return optimizationResult;
  }

  /**
   * Generate prompt variations for optimization
   */
  protected generatePromptVariations(): string[] {
    const baseInstruction = this.signature.instruction;
    
    return [
      baseInstruction, // Original
      `Think step by step. ${baseInstruction}`, // Chain of thought
      `${baseInstruction}\n\nEnsure your response is detailed and well-reasoned.`, // Enhanced detail
      `As an expert in this domain: ${baseInstruction}`, // Authority framing
      `${baseInstruction}\n\nConsider multiple perspectives before providing your final answer.`, // Multiple perspectives
    ];
  }

  /**
   * Default metric for optimization when none provided
   */
  protected defaultMetric(expected: Record<string, any>, actual: Record<string, any>): number {
    let score = 0;
    let totalFields = 0;

    Object.keys(expected).forEach(key => {
      if (actual[key]) {
        // Simple string similarity check
        const similarity = this.calculateStringSimilarity(
          expected[key].toString().toLowerCase(),
          actual[key].toString().toLowerCase()
        );
        score += similarity;
      }
      totalFields++;
    });

    return totalFields > 0 ? score / totalFields : 0;
  }

  /**
   * Calculate string similarity (simplified Jaccard similarity)
   */
  protected calculateStringSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  /**
   * Calculate consistency of responses
   */
  protected calculateConsistency(): number {
    // Simplified consistency calculation
    return this.examples.length > 0 ? Math.min(0.9, 0.5 + (this.examples.length * 0.1)) : 0.5;
  }

  /**
   * Validate inputs against signature
   */
  protected validateInputs(inputs: Record<string, any>): void {
    Object.keys(this.signature.input_fields).forEach(field => {
      if (!(field in inputs)) {
        throw new Error(`Missing required input field: ${field}`);
      }
    });
  }

  /**
   * Post-process module results - can be overridden by subclasses
   */
  protected postProcess(result: Record<string, any>, inputs: Record<string, any>): Record<string, any> {
    return result;
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): DSPyOptimizationResult[] {
    return [...this.optimizationHistory];
  }

  /**
   * Reset module to initial state
   */
  reset(): void {
    this.examples = [];
    this.optimizationHistory = [];
  }
}