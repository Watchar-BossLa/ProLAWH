
import { useState, useCallback } from 'react';
import { SwarmCoordination } from '../types/enhancedAgenticTypes';
import { SwarmCoordinationService } from './swarmCoordinationService';
import { SwarmCoordinationRequest } from './types';

export function useSwarmCoordination() {
  const [activeSwarms, setActiveSwarms] = useState<SwarmCoordination[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const createSwarmCoordination = useCallback(async (
    task: string,
    participatingAgents: string[],
    coordinationStrategy: 'hierarchical' | 'distributed' | 'consensus' = 'distributed'
  ) => {
    setIsProcessing(true);
    try {
      const request: SwarmCoordinationRequest = {
        task,
        participatingAgents,
        coordinationStrategy
      };

      const newSwarm = SwarmCoordinationService.createSwarmCoordination(request);
      setActiveSwarms(prev => [...prev, newSwarm]);
      
      // Simulate swarm coordination process
      setTimeout(() => {
        setActiveSwarms(prev => prev.map(swarm => 
          swarm.swarm_id === newSwarm.swarm_id 
            ? SwarmCoordinationService.simulateSwarmProgress(swarm)
            : swarm
        ));
      }, 3000);

    } catch (error) {
      console.error('Error creating swarm coordination:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    activeSwarms,
    isProcessing,
    createSwarmCoordination
  };
}
