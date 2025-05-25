
import { useState, useCallback } from 'react';
import { ReinforcementLearningState } from '../types/enhancedAgenticTypes';
import { ReinforcementLearningService } from './reinforcementLearningService';

export function useReinforcementLearning() {
  const [learningStates, setLearningStates] = useState<ReinforcementLearningState[]>([]);

  const updateReinforcementLearning = useCallback(async (
    agentId: string,
    action: string,
    reward: number,
    newState: any
  ) => {
    try {
      const updatedStates = ReinforcementLearningService.updateLearningState(
        learningStates,
        { agentId, action, reward, newState }
      );
      
      setLearningStates(updatedStates);
    } catch (error) {
      console.error('Error updating reinforcement learning:', error);
    }
  }, [learningStates]);

  return {
    learningStates,
    updateReinforcementLearning
  };
}
