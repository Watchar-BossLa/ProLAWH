
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { AIAgent, AgentAction, convertToAIAgent, convertToAgentAction } from './types/agenticTypes';

export function useAgenticAssistant() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize user's AI agents
  const initializeAgents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has agents
      const { data: existingAgents } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id);

      if (!existingAgents || existingAgents.length === 0) {
        // Create default agents
        const defaultAgents = [
          {
            user_id: user.id,
            agent_type: 'career_twin',
            personality_profile: {
              communication_style: 'encouraging',
              proactivity_level: 0.8,
              specialization_areas: ['career_development', 'skill_analysis'],
              learning_preferences: ['visual', 'interactive']
            },
            knowledge_state: { initialized: true },
            goal_hierarchy: { primary: 'career_advancement' },
            learning_parameters: { learning_rate: 0.1 },
            conversation_context: [],
            autonomy_level: 4
          },
          {
            user_id: user.id,
            agent_type: 'skill_advisor',
            personality_profile: {
              communication_style: 'analytical',
              proactivity_level: 0.7,
              specialization_areas: ['skill_gaps', 'learning_paths'],
              learning_preferences: ['structured', 'goal_oriented']
            },
            knowledge_state: { initialized: true },
            goal_hierarchy: { primary: 'skill_optimization' },
            learning_parameters: { learning_rate: 0.1 },
            conversation_context: [],
            autonomy_level: 3
          }
        ];

        const { data: newAgents, error } = await supabase
          .from('ai_agents')
          .insert(defaultAgents)
          .select();

        if (error) throw error;
        
        setAgents(newAgents?.map(convertToAIAgent) || []);
      } else {
        setAgents(existingAgents.map(convertToAIAgent));
      }
    } catch (error) {
      console.error('Error initializing agents:', error);
      toast({
        title: "Error",
        description: "Failed to initialize AI agents",
        variant: "destructive"
      });
    }
  }, []);

  // Initialize specific agent type
  const initializeAgent = useCallback(async (
    agentType: 'career_twin' | 'skill_advisor' | 'network_facilitator' | 'opportunity_scout',
    userSkills: string[],
    careerGoals: string[]
  ) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if agent already exists
      const { data: existingAgent } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_type', agentType)
        .single();

      if (!existingAgent) {
        const agentConfig = {
          user_id: user.id,
          agent_type: agentType,
          personality_profile: {
            communication_style: agentType === 'career_twin' ? 'encouraging' : 'analytical',
            proactivity_level: 0.8,
            specialization_areas: [agentType.replace('_', ' ')],
            learning_preferences: ['adaptive']
          },
          knowledge_state: { 
            initialized: true,
            user_skills: userSkills,
            career_goals: careerGoals
          },
          goal_hierarchy: { primary: agentType },
          learning_parameters: { learning_rate: 0.1 },
          conversation_context: [],
          autonomy_level: 4
        };

        const { data: newAgent, error } = await supabase
          .from('ai_agents')
          .insert(agentConfig)
          .select()
          .single();

        if (error) throw error;
        
        setAgents(prev => [...prev, convertToAIAgent(newAgent)]);
      }
    } catch (error) {
      console.error('Error initializing agent:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Generate proactive action
  const generateProactiveAction = useCallback(async (
    agent: AIAgent,
    actionType: string,
    context: any
  ) => {
    setIsProcessing(true);
    try {
      const actionData = {
        agent_id: agent.id,
        user_id: agent.user_id,
        action_type: 'proactive_nudge',
        action_data: {
          title: `${actionType} Suggestion`,
          message: `Based on your recent activity, I have a suggestion for you.`,
          action_items: ['Review the suggestion', 'Take action if relevant']
        },
        reasoning: { context, agent_type: agent.agent_type },
        confidence_score: 0.8,
        urgency_level: 3,
        status: 'pending'
      };

      const { data: newAction, error } = await supabase
        .from('agent_actions')
        .insert(actionData)
        .select()
        .single();

      if (error) throw error;
      
      setActions(prev => [convertToAgentAction(newAction), ...prev]);
    } catch (error) {
      console.error('Error generating proactive action:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Process user feedback
  const processUserFeedback = useCallback(async (
    actionId: string,
    feedback: 'positive' | 'negative'
  ) => {
    try {
      const status = feedback === 'positive' ? 'acted_upon' : 'dismissed';
      
      const { error } = await supabase
        .from('agent_actions')
        .update({
          status,
          user_feedback: { feedback, timestamp: new Date().toISOString() },
          effectiveness_score: feedback === 'positive' ? 0.9 : 0.1,
          updated_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;
      
      await fetchActions();
    } catch (error) {
      console.error('Error processing feedback:', error);
      toast({
        title: "Error",
        description: "Failed to process feedback",
        variant: "destructive"
      });
    }
  }, []);

  // Fetch pending actions
  const fetchActions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agent_actions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setActions(data?.map(convertToAgentAction) || []);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([initializeAgents(), fetchActions()]);
      setIsLoading(false);
    };

    loadData();
  }, [initializeAgents, fetchActions]);

  // Subscribe to real-time updates
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const actionsSubscription = supabase
        .channel('agent_actions_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'agent_actions',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchActions();
        })
        .subscribe();

      return () => {
        actionsSubscription.unsubscribe();
      };
    };

    setupSubscription();
  }, [fetchActions]);

  // Mark action as acted upon
  const markActionAsActedUpon = useCallback(async (actionId: string, feedback?: any) => {
    try {
      const { error } = await supabase
        .from('agent_actions')
        .update({
          status: 'acted_upon',
          user_feedback: feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;
      
      await fetchActions();
    } catch (error) {
      console.error('Error updating action:', error);
      toast({
        title: "Error",
        description: "Failed to update action status",
        variant: "destructive"
      });
    }
  }, [fetchActions]);

  // Dismiss action
  const dismissAction = useCallback(async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('agent_actions')
        .update({
          status: 'dismissed',
          updated_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;
      
      await fetchActions();
    } catch (error) {
      console.error('Error dismissing action:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss action",
        variant: "destructive"
      });
    }
  }, [fetchActions]);

  return {
    agents,
    actions,
    isLoading,
    isProcessing,
    initializeAgent,
    generateProactiveAction,
    processUserFeedback,
    markActionAsActedUpon,
    dismissAction,
    refetchActions: fetchActions
  };
}
