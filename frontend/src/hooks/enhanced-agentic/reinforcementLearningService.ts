
import { ReinforcementLearningState } from '../types/enhancedAgenticTypes';
import { ReinforcementLearningUpdate } from './types';

export class ReinforcementLearningService {
  static updateLearningState(
    currentStates: ReinforcementLearningState[],
    update: ReinforcementLearningUpdate
  ): ReinforcementLearningState[] {
    const existingState = currentStates.find(state => state.agent_id === update.agentId);
    
    if (existingState) {
      return currentStates.map(state => 
        state.agent_id === update.agentId
          ? {
              ...state,
              reward_history: [
                ...state.reward_history,
                { 
                  action: update.action, 
                  reward: update.reward, 
                  timestamp: new Date().toISOString() 
                }
              ],
              learning_episode: state.learning_episode + 1,
              state_representation: update.newState
            }
          : state
      );
    } else {
      const newLearningState: ReinforcementLearningState = {
        agent_id: update.agentId,
        state_representation: update.newState,
        available_actions: ['analyze', 'recommend', 'learn', 'coordinate'],
        policy_weights: [0.25, 0.25, 0.25, 0.25],
        value_estimates: [0.8, 0.9, 0.7, 0.85],
        reward_history: [{ 
          action: update.action, 
          reward: update.reward, 
          timestamp: new Date().toISOString() 
        }],
        learning_episode: 1
      };
      
      return [...currentStates, newLearningState];
    }
  }

  static createInitialLearningState(agentId: string): ReinforcementLearningState {
    return {
      agent_id: agentId,
      state_representation: { initialized: true },
      available_actions: ['analyze', 'recommend', 'learn', 'coordinate'],
      policy_weights: [0.25, 0.25, 0.25, 0.25],
      value_estimates: [0.8, 0.9, 0.7, 0.85],
      reward_history: [],
      learning_episode: 0
    };
  }
}
