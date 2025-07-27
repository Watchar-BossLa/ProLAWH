
import { useState, useCallback } from 'react';
import { AgentReasoningChain } from '../types/enhancedAgenticTypes';
import { ReasoningChainService } from './reasoningChainService';

export function useReasoningChains() {
  const [reasoningChains, setReasoningChains] = useState<AgentReasoningChain[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateReasoningChain = useCallback(async (
    agentId: string,
    problem: string,
    context: any
  ) => {
    setIsProcessing(true);
    try {
      const reasoningChain = ReasoningChainService.generateReasoningChain({
        agentId,
        problem,
        context
      });

      setReasoningChains(prev => [reasoningChain, ...prev]);
      
    } catch (error) {
      console.error('Error generating reasoning chain:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    reasoningChains,
    isProcessing,
    generateReasoningChain
  };
}
