
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AIAgent {
  id: string;
  user_id: string;
  agent_type: 'career_twin' | 'skill_advisor' | 'network_facilitator' | 'opportunity_scout';
  personality_profile: {
    communication_style: 'formal' | 'casual' | 'encouraging' | 'analytical';
    proactivity_level: number; // 1-5
    specialization_areas: string[];
    learning_preferences: string[];
  };
  knowledge_state: {
    user_skills: string[];
    career_goals: string[];
    market_insights: Record<string, any>;
    learned_patterns: Record<string, any>;
  };
  goal_hierarchy: {
    primary_goals: string[];
    secondary_goals: string[];
    constraints: string[];
  };
  learning_parameters: {
    adaptation_rate: number;
    confidence_threshold: number;
    exploration_factor: number;
  };
  conversation_context: any[];
  autonomy_level: number;
  is_active: boolean;
}

interface AgentAction {
  id: string;
  agent_id: string;
  action_type: 'proactive_nudge' | 'skill_recommendation' | 'opportunity_alert' | 'network_introduction' | 'learning_path_adjustment';
  action_data: {
    title: string;
    message: string;
    action_items?: string[];
    resources?: any[];
    deadline?: string;
  };
  reasoning: {
    trigger_event: string;
    decision_factors: string[];
    expected_outcome: string;
    alternative_considered: string[];
  };
  confidence_score: number;
  urgency_level: number;
  status: 'pending' | 'delivered' | 'acted_upon' | 'dismissed' | 'expired';
  user_feedback?: any;
  effectiveness_score?: number;
}

interface LearningEvent {
  id: string;
  agent_id: string;
  event_type: 'reinforcement' | 'pattern_discovery' | 'parameter_adjustment' | 'knowledge_update';
  input_data: any;
  output_data: any;
  learning_delta: any;
  confidence_before: number;
  confidence_after: number;
  validation_score?: number;
}

export function useAgenticAssistant() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [learningEvents, setLearningEvents] = useState<LearningEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize AI agent for user
  const initializeAgent = async (
    agentType: AIAgent['agent_type'],
    userSkills: string[],
    careerGoals: string[]
  ) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const personalityProfile = {
        communication_style: 'encouraging' as const,
        proactivity_level: 4,
        specialization_areas: ['green_economy', 'skill_development', 'career_growth'],
        learning_preferences: ['interactive', 'data_driven', 'personalized']
      };

      const knowledgeState = {
        user_skills: userSkills,
        career_goals: careerGoals,
        market_insights: {},
        learned_patterns: {}
      };

      const goalHierarchy = {
        primary_goals: ['optimize_skill_development', 'identify_opportunities', 'facilitate_growth'],
        secondary_goals: ['build_network', 'track_progress', 'provide_insights'],
        constraints: ['respect_user_preferences', 'maintain_privacy', 'ensure_accuracy']
      };

      const learningParameters = {
        adaptation_rate: 0.1,
        confidence_threshold: 0.7,
        exploration_factor: 0.2
      };

      const { data: agent, error } = await supabase
        .from('ai_agents')
        .insert({
          user_id: user.id,
          agent_type: agentType,
          personality_profile: personalityProfile,
          knowledge_state: knowledgeState,
          goal_hierarchy: goalHierarchy,
          learning_parameters: learningParameters,
          conversation_context: [],
          autonomy_level: 3,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setAgents(prev => [...prev, agent as AIAgent]);
      
      console.log('AI Agent initialized:', agent);
      return agent as AIAgent;
    } catch (error) {
      console.error('Error initializing agent:', error);
      toast({
        title: "Agent Initialization Error",
        description: "Failed to initialize AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Agent decision-making engine
  const generateProactiveAction = async (
    agent: AIAgent,
    triggerEvent: string,
    contextData: any
  ) => {
    setIsProcessing(true);
    try {
      // Simulate AI decision-making process
      const decisionFactors = [
        'user_skill_gaps',
        'market_opportunities',
        'learning_momentum',
        'career_progression_rate'
      ];

      let actionType: AgentAction['action_type'] = 'proactive_nudge';
      let actionData: AgentAction['action_data'];
      let confidenceScore = 0.8;
      let urgencyLevel = 3;

      // Decision logic based on agent type and context
      switch (agent.agent_type) {
        case 'career_twin':
          if (triggerEvent === 'skill_gap_detected') {
            actionType = 'skill_recommendation';
            actionData = {
              title: 'Skill Development Opportunity Detected',
              message: 'Based on market analysis, I\'ve identified a critical skill gap that could accelerate your career growth.',
              action_items: [
                'Complete Python for Data Science course',
                'Practice on real-world projects',
                'Connect with Python community mentors'
              ],
              resources: [
                { type: 'course', title: 'Advanced Python', url: '/learning/python-advanced' },
                { type: 'project', title: 'Green Data Analytics', url: '/projects/green-analytics' }
              ],
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            confidenceScore = 0.85;
            urgencyLevel = 4;
          }
          break;

        case 'opportunity_scout':
          if (triggerEvent === 'new_opportunity_match') {
            actionType = 'opportunity_alert';
            actionData = {
              title: 'High-Match Opportunity Discovered',
              message: 'I found a project that perfectly aligns with your quantum skills and career goals.',
              action_items: [
                'Review project details',
                'Prepare tailored application',
                'Connect with project lead'
              ],
              resources: [
                { type: 'opportunity', title: 'Quantum Green Computing', url: '/opportunities/quantum-green' }
              ]
            };
            confidenceScore = 0.9;
            urgencyLevel = 5;
          }
          break;

        case 'network_facilitator':
          actionType = 'network_introduction';
          actionData = {
            title: 'Strategic Network Connection',
            message: 'I\'ve identified a mentor who could significantly impact your quantum computing journey.',
            action_items: [
              'Review mentor profile',
              'Send personalized connection request',
              'Prepare for introductory conversation'
            ]
          };
          break;

        default:
          actionData = {
            title: 'AI Assistant Update',
            message: 'I\'m continuously learning about your preferences to provide better assistance.',
            action_items: ['Continue engaging with the platform']
          };
      }

      const reasoning = {
        trigger_event: triggerEvent,
        decision_factors: decisionFactors,
        expected_outcome: 'Improved user skill development and career progression',
        alternative_considered: ['wait_for_more_data', 'different_recommendation_type']
      };

      // Create agent action
      const { data: action, error } = await supabase
        .from('agent_actions')
        .insert({
          agent_id: agent.id,
          user_id: agent.user_id,
          action_type: actionType,
          action_data: actionData,
          reasoning: reasoning,
          confidence_score: confidenceScore,
          urgency_level: urgencyLevel,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setActions(prev => [...prev, action as AgentAction]);

      // Log learning event
      await logLearningEvent(agent.id, 'pattern_discovery', {
        trigger: triggerEvent,
        context: contextData
      }, {
        action_generated: action,
        confidence: confidenceScore
      });

      console.log('Proactive action generated:', action);
      return action as AgentAction;
    } catch (error) {
      console.error('Error generating proactive action:', error);
      toast({
        title: "Agent Action Error",
        description: "Failed to generate proactive action",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Agent learning mechanism
  const logLearningEvent = async (
    agentId: string,
    eventType: LearningEvent['event_type'],
    inputData: any,
    outputData: any
  ) => {
    try {
      // Simulate learning delta calculation
      const learningDelta = {
        knowledge_update: outputData,
        parameter_adjustments: {
          confidence_adjustment: 0.05,
          pattern_recognition: 0.03
        }
      };

      const confidenceBefore = 0.75; // Would be retrieved from agent state
      const confidenceAfter = Math.min(confidenceBefore + 0.05, 1.0);

      const { data: learningEvent, error } = await supabase
        .from('agent_learning_events')
        .insert({
          agent_id: agentId,
          event_type: eventType,
          input_data: inputData,
          output_data: outputData,
          learning_delta: learningDelta,
          confidence_before: confidenceBefore,
          confidence_after: confidenceAfter,
          validation_score: Math.random() * 0.3 + 0.7 // 0.7-1.0
        })
        .select()
        .single();

      if (error) throw error;

      setLearningEvents(prev => [...prev, learningEvent as LearningEvent]);
      return learningEvent as LearningEvent;
    } catch (error) {
      console.error('Error logging learning event:', error);
    }
  };

  // Process user feedback to improve agent performance
  const processUserFeedback = async (
    actionId: string,
    feedback: 'positive' | 'negative' | 'neutral',
    details?: string
  ) => {
    try {
      const userFeedback = {
        rating: feedback,
        details: details,
        timestamp: new Date().toISOString()
      };

      const effectivenessScore = feedback === 'positive' ? 0.9 : 
                               feedback === 'negative' ? 0.3 : 0.6;

      const { error } = await supabase
        .from('agent_actions')
        .update({
          user_feedback: userFeedback,
          effectiveness_score: effectivenessScore,
          status: 'acted_upon'
        })
        .eq('id', actionId);

      if (error) throw error;

      // Update local state
      setActions(prev => prev.map(action => 
        action.id === actionId 
          ? { ...action, user_feedback: userFeedback, effectiveness_score: effectivenessScore }
          : action
      ));

      console.log('User feedback processed:', userFeedback);
    } catch (error) {
      console.error('Error processing user feedback:', error);
      toast({
        title: "Feedback Error",
        description: "Failed to process feedback",
        variant: "destructive"
      });
    }
  };

  // Fetch user's AI agents
  const fetchUserAgents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agentsData } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (agentsData) {
        setAgents(agentsData as AIAgent[]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  }, []);

  // Fetch pending actions
  const fetchPendingActions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: actionsData } = await supabase
        .from('agent_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('urgency_level', { ascending: false });

      if (actionsData) {
        setActions(actionsData as AgentAction[]);
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserAgents();
    fetchPendingActions();
  }, [fetchUserAgents, fetchPendingActions]);

  return {
    agents,
    actions,
    learningEvents,
    isProcessing,
    initializeAgent,
    generateProactiveAction,
    processUserFeedback,
    logLearningEvent,
    fetchUserAgents,
    fetchPendingActions
  };
}
