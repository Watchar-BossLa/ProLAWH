
import { Json } from "@/integrations/supabase/types";

export interface AIAgent {
  id: string;
  user_id: string;
  agent_type: 'career_twin' | 'skill_advisor' | 'network_facilitator' | 'opportunity_scout';
  personality_profile: {
    communication_style: 'encouraging' | 'formal' | 'casual' | 'analytical';
    proactivity_level: number;
    specialization_areas: string[];
    learning_preferences: string[];
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

export interface AgentAction {
  id: string;
  agent_id: string;
  user_id: string;
  action_type: 'proactive_nudge' | 'skill_recommendation' | 'opportunity_alert' | 'network_introduction' | 'learning_path_adjustment';
  action_data: {
    title: string;
    message: string;
    action_items?: string[];
    resources?: any[];
    deadline?: string;
  };
  reasoning: any;
  confidence_score: number;
  urgency_level: number;
  status: 'pending' | 'delivered' | 'acted_upon' | 'dismissed' | 'expired';
  user_feedback?: any;
  effectiveness_score?: number;
  created_at: string;
  updated_at: string;
}

// Type conversion utilities
export function convertToAIAgent(dbRecord: any): AIAgent {
  return {
    ...dbRecord,
    personality_profile: dbRecord.personality_profile as AIAgent['personality_profile'],
    knowledge_state: dbRecord.knowledge_state,
    goal_hierarchy: dbRecord.goal_hierarchy,
    learning_parameters: dbRecord.learning_parameters,
    conversation_context: Array.isArray(dbRecord.conversation_context) 
      ? dbRecord.conversation_context 
      : []
  };
}

export function convertToAgentAction(dbRecord: any): AgentAction {
  return {
    ...dbRecord,
    action_data: dbRecord.action_data as AgentAction['action_data'],
    reasoning: dbRecord.reasoning,
    user_feedback: dbRecord.user_feedback
  };
}
