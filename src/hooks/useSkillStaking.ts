
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStake, fetchUserStakes, getInsuranceQuote } from '@/services/stakingService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { StakeData } from '@/services/stakingService';

export function useSkillStaking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
  
  // Fetch user's active stakes
  const { 
    data: userStakes = [], 
    isLoading: isStakesLoading 
  } = useQuery({
    queryKey: ['userStakes', user?.id],
    queryFn: () => user ? fetchUserStakes(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  // Create stake mutation
  const stakeMutation = useMutation({
    mutationFn: (stakeData: StakeData) => createStake(stakeData),
    onSuccess: () => {
      toast({
        title: "Stake Created",
        description: "Your stake has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['userStakes', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Stake Creation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Get insurance quote for a project
  const getQuote = async (projectId: string, amount: number) => {
    try {
      const quote = await getInsuranceQuote(projectId, amount);
      return quote;
    } catch (error) {
      toast({
        title: "Failed to Get Insurance Quote",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Create a new stake
  const createUserStake = (stakeData: StakeData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to stake on projects",
        variant: "destructive",
      });
      return;
    }
    
    stakeMutation.mutate(stakeData);
  };
  
  return {
    userStakes,
    isStakesLoading,
    isStaking: stakeMutation.isPending,
    createStake: createUserStake,
    getInsuranceQuote: getQuote,
    isInsuranceDialogOpen,
    setIsInsuranceDialogOpen
  };
}
