
import { Json } from "@/integrations/supabase/types";

export interface EnhancedAIAgent extends BaseAIAgent {
  reasoning_engine: {
    type: 'symbolic' | 'neural' | 'hybrid';
    confidence_threshold: number;
    reasoning_depth: number;
    chain_of_thought: boolean;
  };
  coordination_config: {
    swarm_enabled: boolean;
    coordination_protocols: string[];
    peer_agents: string[];
    collective_intelligence: boolean;
  };
  reinforcement_learning: {
    reward_model: any;
    policy_network: any;
    experience_buffer: any[];
    learning_rate: number;
    exploration_rate: number;
  };
  performance_metrics: {
    success_rate: number;
    user_satisfaction: number;
    task_completion_time: number;
    reasoning_accuracy: number;
  };
}

export interface BaseAIAgent {
  id: string;
  user_id: string;
  agent_type: 'career_twin' | 'skill_advisor' | 'network_facilitator' | 'opportunity_scout' | 'learning_coordinator' | 'green_skills_specialist';
  domain_expertise: string[];
  personality_profile: {
    communication_style: 'encouraging' | 'formal' | 'casual' | 'analytical' | 'adaptive';
    proactivity_level: number;
    specialization_areas: string[];
    learning_preferences: string[];
    reasoning_style: 'deductive' | 'inductive' | 'abductive' | 'creative';
  };
  knowledge_state: any;
  goal_hierarchy: any;
  learning_parameters: any;
  conversation_context: any[];
  autonomy_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SwarmCoordination {
  swarm_id: string;
  participating_agents: string[];
  coordination_task: string;
  collective_reasoning: any;
  consensus_threshold: number;
  emergence_patterns: any[];
  swarm_intelligence_metrics: {
    collective_accuracy: number;
    emergent_behaviors: string[];
    coordination_efficiency: number;
  };
}

export interface AgentReasoningChain {
  id: string;
  agent_id: string;
  reasoning_steps: Array<{
    step: number;
    thought: string;
    evidence: any[];
    confidence: number;
    reasoning_type: 'logical' | 'probabilistic' | 'analogical' | 'causal';
  }>;
  conclusion: any;
  confidence_score: number;
  validation_status: 'pending' | 'validated' | 'rejected';
}

export interface ReinforcementLearningState {
  agent_id: string;
  state_representation: any;
  available_actions: string[];
  policy_weights: number[];
  value_estimates: number[];
  reward_history: Array<{
    action: string;
    reward: number;
    timestamp: string;
  }>;
  learning_episode: number;
}

export interface MultiAgentTask {
  id: string;
  task_description: string;
  required_capabilities: string[];
  assigned_agents: string[];
  coordination_strategy: 'hierarchical' | 'distributed' | 'auction_based' | 'consensus';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  collective_result: any;
  performance_metrics: any;
}
