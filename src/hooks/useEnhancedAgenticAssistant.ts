
import { useEnhancedAgents } from './enhanced-agentic/useEnhancedAgents';
import { useSwarmCoordination } from './enhanced-agentic/useSwarmCoordination';
import { useReasoningChains } from './enhanced-agentic/useReasoningChains';
import { useReinforcementLearning } from './enhanced-agentic/useReinforcementLearning';

export function useEnhancedAgenticAssistant() {
  const { 
    enhancedAgents, 
    isLoading: agentsLoading 
  } = useEnhancedAgents();
  
  const { 
    activeSwarms, 
    isProcessing: swarmProcessing,
    createSwarmCoordination 
  } = useSwarmCoordination();
  
  const { 
    reasoningChains, 
    isProcessing: reasoningProcessing,
    generateReasoningChain 
  } = useReasoningChains();
  
  const { 
    learningStates, 
    updateReinforcementLearning 
  } = useReinforcementLearning();

  const isLoading = agentsLoading;
  const isProcessing = swarmProcessing || reasoningProcessing;

  return {
    enhancedAgents,
    activeSwarms,
    reasoningChains,
    learningStates,
    isLoading,
    isProcessing,
    createSwarmCoordination,
    generateReasoningChain,
    updateReinforcementLearning
  };
}
