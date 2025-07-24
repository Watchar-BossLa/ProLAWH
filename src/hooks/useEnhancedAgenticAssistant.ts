
import { useEnhancedAgents } from './enhanced-agentic/useEnhancedAgents';
import { useSwarmCoordination } from './enhanced-agentic/useSwarmCoordination';
import { useReasoningChains } from './enhanced-agentic/useReasoningChains';
import { useReinforcementLearning } from './enhanced-agentic/useReinforcementLearning';
import { useDSPy } from './dspy/useDSPy';

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

  const {
    getEnhancedReasoningChain,
    getCareerAdvice,
    getSwarmCoordination,
    optimizeModule,
    optimizeAllModules,
    isInitialized: dspyInitialized,
    isOptimizing: dspyOptimizing,
    performanceMetrics: dspyMetrics
  } = useDSPy();

  const isLoading = agentsLoading;
  const isProcessing = swarmProcessing || reasoningProcessing;

  return {
    // Existing functionality
    enhancedAgents,
    activeSwarms,
    reasoningChains,
    learningStates,
    isLoading,
    isProcessing,
    createSwarmCoordination,
    generateReasoningChain,
    updateReinforcementLearning,
    
    // DSPy-enhanced functionality
    getEnhancedReasoningChain,
    getCareerAdvice,
    getSwarmCoordination,
    optimizeModule,
    optimizeAllModules,
    dspyInitialized,
    dspyOptimizing,
    dspyMetrics
  };
}
