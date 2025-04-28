
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

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
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
