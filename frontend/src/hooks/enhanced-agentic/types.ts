
export interface EnhancedAgentConfig {
  user_id: string;
  agent_type: string;
  personality_profile: {
    communication_style: string;
    proactivity_level: number;
    specialization_areas: string[];
    learning_preferences: string[];
    reasoning_style?: string;
  };
  knowledge_state: {
    initialized: boolean;
    domain_knowledge?: string[];
    reasoning_engine?: {
      type: string;
      confidence_threshold: number;
      reasoning_depth: number;
      chain_of_thought: boolean;
    };
  };
  goal_hierarchy: {
    primary: string;
    secondary?: string[];
  };
  learning_parameters: {
    learning_rate: number;
    exploration_rate: number;
    reward_model: string;
  };
  conversation_context: any[];
  autonomy_level: number;
}

export interface SwarmCoordinationRequest {
  task: string;
  participatingAgents: string[];
  coordinationStrategy?: 'hierarchical' | 'distributed' | 'consensus';
}

export interface ReasoningChainRequest {
  agentId: string;
  problem: string;
  context: any;
}

export interface ReinforcementLearningUpdate {
  agentId: string;
  action: string;
  reward: number;
  newState: any;
}
