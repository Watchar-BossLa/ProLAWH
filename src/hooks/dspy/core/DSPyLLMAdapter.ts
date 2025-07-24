import { useLLM } from '@/hooks/useLLM';

export interface DSPyLLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stop_sequences?: string[];
}

export interface DSPyLLMResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: Record<string, any>;
}

/**
 * DSPy LLM Adapter - Bridges DSPy framework with our existing LLM service
 * This adapter allows DSPy to use our Supabase edge function for LLM inference
 */
export class DSPyLLMAdapter {
  private llm: ReturnType<typeof useLLM>;

  constructor(llm: ReturnType<typeof useLLM>) {
    this.llm = llm;
  }

  /**
   * Generate response using our LLM service
   */
  async generate(request: DSPyLLMRequest): Promise<DSPyLLMResponse> {
    try {
      const response = await this.llm.generate({
        task: 'text-generation',
        inputs: request.prompt,
        model: request.model || 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      });

      return {
        text: response.generated_text || response.text || '',
        usage: {
          prompt_tokens: request.prompt.length / 4, // Rough estimation
          completion_tokens: (response.generated_text || response.text || '').length / 4,
          total_tokens: (request.prompt.length + (response.generated_text || response.text || '').length) / 4
        },
        metadata: {
          model: request.model,
          temperature: request.temperature,
          max_tokens: request.max_tokens
        }
      };
    } catch (error) {
      console.error('DSPy LLM Adapter error:', error);
      throw new Error(`LLM generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format prompt for DSPy signature execution
   */
  formatPrompt(signature: any, inputs: Record<string, any>): string {
    let prompt = `${signature.instruction}\n\n`;
    
    // Add input fields
    Object.entries(signature.input_fields).forEach(([field, description]) => {
      prompt += `${field}: ${inputs[field] || 'Not provided'}\n`;
    });

    // Add output format
    prompt += '\nProvide your response in the following format:\n';
    Object.entries(signature.output_fields).forEach(([field, description]) => {
      prompt += `${field}: [Your ${description} here]\n`;
    });

    return prompt;
  }

  /**
   * Parse LLM response according to DSPy signature output fields
   */
  parseResponse(response: string, outputFields: Record<string, string>): Record<string, any> {
    const parsed: Record<string, any> = {};
    
    Object.keys(outputFields).forEach(field => {
      const regex = new RegExp(`${field}:\\s*(.+?)(?=\\n\\w+:|$)`, 'i');
      const match = response.match(regex);
      parsed[field] = match ? match[1].trim() : '';
    });

    return parsed;
  }

  /**
   * Execute DSPy signature with inputs
   */
  async executeSignature(signature: any, inputs: Record<string, any>): Promise<Record<string, any>> {
    const prompt = this.formatPrompt(signature, inputs);
    const response = await this.generate({ prompt });
    return this.parseResponse(response.text, signature.output_fields);
  }
}