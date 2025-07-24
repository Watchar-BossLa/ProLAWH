/**
 * ReAct (Reasoning + Acting) Pattern Implementation for DSPy
 * Combines reasoning, observation, and action in iterative loops
 */

import { DSPyBaseModule } from './DSPyBaseModule';
import { DSPyLLMAdapter } from '../core/DSPyLLMAdapter';
import { DSPyTrainingExample } from '../types';

interface ReActStep {
  type: 'thought' | 'action' | 'observation';
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface ReActResult {
  steps: ReActStep[];
  finalAnswer: string;
  reasoning: string;
  actionsTaken: string[];
  observations: string[];
  success: boolean;
  iterations: number;
}

export class ReActPatternModule extends DSPyBaseModule {
  private maxIterations: number = 10;
  private tools: Map<string, Function> = new Map();

  constructor(llmAdapter: DSPyLLMAdapter) {
    const signature = {
      input_fields: {
        question: "string - The question or problem to solve",
        context: "string - Additional context or background information",
        available_tools: "array - List of available tools and their descriptions"
      },
      output_fields: {
        thought: "string - Current reasoning or thinking step",
        action: "string - Action to take (tool_name:parameters)",
        observation: "string - Result of the previous action",
        final_answer: "string - Final answer when reasoning is complete"
      },
      instruction: `You are an AI assistant that uses the ReAct (Reasoning + Acting) pattern.
        
For each step, you should:
1. Think about the problem and what you need to do next
2. Take an action using available tools or provide a final answer
3. Observe the results of your action
4. Continue until you have a complete answer

Available actions:
- search_knowledge: Search for relevant information
- calculate: Perform mathematical calculations  
- analyze_data: Analyze provided data
- final_answer: Provide the final answer

Format your response as:
Thought: [Your reasoning about what to do next]
Action: [tool_name:parameters OR final_answer:your_answer]
Observation: [Results of your action - will be filled automatically]`
    };

    super('react_pattern', signature, llmAdapter, {
      temperature: 0.3,
      max_tokens: 1000
    });

    this.setupDefaultTools();
  }

  async execute(
    question: string, 
    context: string = '', 
    maxIterations?: number
  ): Promise<ReActResult> {
    const steps: ReActStep[] = [];
    const actionsTaken: string[] = [];
    const observations: string[] = [];
    let currentIteration = 0;
    const maxIter = maxIterations || this.maxIterations;

    let thought = '';
    let action = '';
    let observation = '';
    let finalAnswer = '';

    while (currentIteration < maxIter) {
      try {
        // Generate next step
        const inputs = {
          question,
          context: context + this.formatPreviousSteps(steps),
          available_tools: Array.from(this.tools.keys()).join(', ')
        };

        const result = await this.forward(inputs);
        
        // Parse thought and action
        thought = result.thought || '';
        action = result.action || '';

        // Record thought step
        if (thought) {
          steps.push({
            type: 'thought',
            content: thought,
            timestamp: new Date(),
            confidence: this.extractConfidence(thought)
          });
        }

        // Check if this is a final answer
        if (action.startsWith('final_answer:')) {
          finalAnswer = action.replace('final_answer:', '').trim();
          break;
        }

        // Execute action
        if (action) {
          steps.push({
            type: 'action',
            content: action,
            timestamp: new Date()
          });

          observation = await this.executeAction(action);
          actionsTaken.push(action);
          observations.push(observation);

          steps.push({
            type: 'observation',
            content: observation,
            timestamp: new Date()
          });
        }

        currentIteration++;
      } catch (error) {
        console.error('ReAct iteration error:', error);
        observation = `Error: ${error.message}`;
        steps.push({
          type: 'observation',
          content: observation,
          timestamp: new Date()
        });
        break;
      }
    }

    return {
      steps,
      finalAnswer: finalAnswer || this.generateFinalAnswer(steps),
      reasoning: this.extractReasoning(steps),
      actionsTaken,
      observations,
      success: !!finalAnswer,
      iterations: currentIteration
    };
  }

  private setupDefaultTools(): void {
    this.tools.set('search_knowledge', async (query: string) => {
      // Mock knowledge search - integrate with your knowledge base
      return `Knowledge search results for: ${query}`;
    });

    this.tools.set('calculate', async (expression: string) => {
      try {
        // Simple calculator - enhance with more advanced math
        const result = eval(expression.replace(/[^0-9+\-*/().\s]/g, ''));
        return `Calculation result: ${result}`;
      } catch (error) {
        return `Calculation error: ${error.message}`;
      }
    });

    this.tools.set('analyze_data', async (data: string) => {
      // Mock data analysis
      return `Data analysis completed for: ${data.substring(0, 100)}...`;
    });
  }

  addTool(name: string, tool: Function): void {
    this.tools.set(name, tool);
  }

  private async executeAction(action: string): Promise<string> {
    const [toolName, ...params] = action.split(':');
    const tool = this.tools.get(toolName.trim());
    
    if (!tool) {
      return `Error: Unknown tool '${toolName}'. Available tools: ${Array.from(this.tools.keys()).join(', ')}`;
    }

    try {
      const result = await tool(params.join(':').trim());
      return result;
    } catch (error) {
      return `Error executing ${toolName}: ${error.message}`;
    }
  }

  private formatPreviousSteps(steps: ReActStep[]): string {
    if (steps.length === 0) return '';
    
    return '\n\nPrevious steps:\n' + 
      steps.map(step => `${step.type.toUpperCase()}: ${step.content}`).join('\n');
  }

  private extractConfidence(thought: string): number {
    // Simple confidence extraction based on uncertainty words
    const uncertaintyWords = ['maybe', 'perhaps', 'might', 'could', 'unsure'];
    const certaintyWords = ['definitely', 'certainly', 'clearly', 'obviously'];
    
    const lowerThought = thought.toLowerCase();
    const uncertainties = uncertaintyWords.filter(word => lowerThought.includes(word)).length;
    const certainties = certaintyWords.filter(word => lowerThought.includes(word)).length;
    
    return Math.max(0.1, Math.min(1.0, 0.7 + (certainties * 0.1) - (uncertainties * 0.1)));
  }

  private extractReasoning(steps: ReActStep[]): string {
    return steps
      .filter(step => step.type === 'thought')
      .map(step => step.content)
      .join(' → ');
  }

  private generateFinalAnswer(steps: ReActStep[]): string {
    const lastObservation = steps
      .filter(step => step.type === 'observation')
      .pop();
    
    return lastObservation?.content || 'Unable to determine final answer';
  }

  generateTrainingExamples(): void {
    const examples: DSPyTrainingExample[] = [
      {
        inputs: {
          question: "What is the population of Tokyo and how does it compare to New York?",
          context: "I need to find population data for major cities",
          available_tools: "search_knowledge, calculate"
        },
        expected_outputs: {
          thought: "I need to search for population data of both Tokyo and New York to compare them",
          action: "search_knowledge:Tokyo population 2024",
          final_answer: "Tokyo has approximately 14 million people in the city proper and 38 million in the greater metropolitan area, making it larger than New York City which has about 8.3 million in the city and 20 million in the metro area."
        }
      }
    ];

    this.addExamples(examples);
  }
}