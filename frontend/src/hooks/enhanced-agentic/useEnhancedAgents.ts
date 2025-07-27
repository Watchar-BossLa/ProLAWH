
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { EnhancedAIAgent } from '../types/enhancedAgenticTypes';
import { AgentTransformationService } from './agentTransformationService';

export function useEnhancedAgents() {
  const [enhancedAgents, setEnhancedAgents] = useState<EnhancedAIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeEnhancedAgents = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingAgents } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', user.id);

      if (!existingAgents || existingAgents.length === 0) {
        const enhancedDefaultAgents = AgentTransformationService.createDefaultEnhancedAgents(user.id);

        const { data: newAgents, error } = await supabase
          .from('ai_agents')
          .insert(enhancedDefaultAgents)
          .select();

        if (error) throw error;
        
        const transformedAgents = (newAgents || []).map(AgentTransformationService.transformToEnhancedAgent);
        setEnhancedAgents(transformedAgents);
      } else {
        const transformedAgents = existingAgents.map(AgentTransformationService.transformToEnhancedAgent);
        setEnhancedAgents(transformedAgents);
      }
    } catch (error) {
      console.error('Error initializing enhanced agents:', error);
      toast({
        title: "Error",
        description: "Failed to initialize enhanced AI agents",
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      await initializeEnhancedAgents();
      setIsLoading(false);
    };

    loadAgents();
  }, [initializeEnhancedAgents]);

  return {
    enhancedAgents,
    isLoading,
    initializeEnhancedAgents
  };
}
