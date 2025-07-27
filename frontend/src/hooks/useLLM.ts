
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LLMRequest {
  task: 'text-generation' | 'image-to-text' | 'text-to-image';
  inputs: string | Blob;
  model?: string;
}

export function useLLM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async ({ task, inputs, model }: LLMRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('llm-inference', {
        body: { task, inputs, model }
      });

      if (error) {
        console.error('LLM inference error:', error);
        throw new Error(error.message || 'LLM service unavailable');
      }
      
      if (!data) {
        throw new Error('No data returned from LLM service');
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'LLM service failed';
      console.error('LLM generation failed:', err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generate,
    isLoading,
    error
  };
}
