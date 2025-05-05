
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePolygonWallet } from '@/hooks/usePolygonWallet';

// Type definitions
export interface StakeData {
  id: string;
  skill_id: string;
  user_id: string;
  amount_usdc: number;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ends_at: string | null;
  skill_name: string;
  skill_category: string;
  poolId?: string;
}

export interface StakingTransaction {
  id: string;
  user_id: string;
  type: 'stake' | 'withdraw' | 'earn';
  amount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  skillName: string;
  skillId: string;
  transactionId: string;
}

export interface RevenuePool {
  id: string;
  name: string;
  description: string;
  apy: number;
  totalValueLocked: number;
  capacity: number;
  participantCount: number;
  type: 'green' | 'defi' | 'tech';
  contractAddress: string;
  userParticipation?: {
    stakedAmount: number;
    currentEarnings: number;
    joinedAt: string;
  };
}

interface StakedSkillData {
  category: string;
  amount: number;
}

/**
 * useSkillStaking - Hook for managing skill staking functionality
 * 
 * This hook provides all the necessary data and functions to interact with the staking system,
 * including creating and managing stakes, handling transactions, and interacting with pools.
 * It integrates with Polygon for on-chain transactions and Supabase for data persistence.
 */
export function useSkillStaking() {
  const { user } = useAuth();
  const { wallet, connectWallet } = usePolygonWallet();
  const queryClient = useQueryClient();
  
  // Fetch user stakes
  const { 
    data: userStakes, 
    isLoading: stakesLoading, 
    error: stakesError 
  } = useQuery({
    queryKey: ["user-stakes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('active_stakes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as StakeData[];
    },
    enabled: !!user
  });
  
  // Fetch staking transactions
  const { 
    data: transactions, 
    isLoading: txLoading, 
    error: txError 
  } = useQuery({
    queryKey: ["staking-transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // This would be replaced with an actual API call
      // Mocked data for now
      const mockTransactions: StakingTransaction[] = [
        {
          id: "tx1",
          user_id: user.id,
          type: "stake",
          amount: 100,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: "completed",
          skillName: "Rust Programming",
          skillId: "skill1",
          transactionId: "0x1234567890abcdef1234567890abcdef12345678"
        },
        {
          id: "tx2",
          user_id: user.id,
          type: "earn",
          amount: 5.75,
          timestamp: new Date().toISOString(),
          status: "completed",
          skillName: "Rust Programming",
          skillId: "skill1",
          transactionId: "0xabcdef1234567890abcdef1234567890abcdef12"
        }
      ];
      
      return mockTransactions;
    },
    enabled: !!user
  });
  
  // Fetch revenue pools
  const { 
    data: revenuePools, 
    isLoading: poolsLoading, 
    error: poolsError 
  } = useQuery({
    queryKey: ["revenue-pools"],
    queryFn: async () => {
      // This would be replaced with an actual API call
      // Mocked data for now
      const mockPools: RevenuePool[] = [
        {
          id: "pool1",
          name: "Green Tech Innovators",
          description: "Pool for sustainable technology skills",
          apy: 12.5,
          totalValueLocked: 25000,
          capacity: 100000,
          participantCount: 48,
          type: "green",
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
          userParticipation: {
            stakedAmount: 100,
            currentEarnings: 3.25,
            joinedAt: new Date(Date.now() - 1209600000).toISOString() // 2 weeks ago
          }
        },
        {
          id: "pool2",
          name: "DeFi Developers",
          description: "Pool for blockchain and finance skills",
          apy: 18.2,
          totalValueLocked: 42000,
          capacity: 150000,
          participantCount: 76,
          type: "defi",
          contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12"
        }
      ];
      
      return mockPools;
    }
  });
  
  // Create a new stake
  const createStake = useMutation({
    mutationFn: async ({ skillId, amount, duration }: { skillId: string, amount: number, duration?: string }) => {
      if (!user) throw new Error("User must be logged in to create a stake");
      
      // Ensure wallet is connected for on-chain transactions
      if (!wallet) {
        await connectWallet();
      }
      
      // Call to Supabase function that would handle the Polygon interaction
      const response = await supabase.functions.invoke('skill-staking', {
        body: { 
          action: 'stake',
          skillId,
          amount,
          duration
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Create stake record in the database
      const { error } = await supabase
        .from('skill_stakes')
        .insert({
          user_id: user.id,
          skill_id: skillId,
          amount_usdc: amount,
          status: 'active'
        });
      
      if (error) throw error;
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stakes"] });
      queryClient.invalidateQueries({ queryKey: ["staking-transactions"] });
      
      toast({
        title: "Stake created successfully",
        description: "Your stake has been successfully created and recorded on-chain.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create stake",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Join a revenue pool
  const joinPool = useMutation({
    mutationFn: async (poolId: string) => {
      if (!user) throw new Error("User must be logged in to join a pool");
      
      // Ensure wallet is connected
      if (!wallet) {
        await connectWallet();
      }
      
      // This would call a Supabase function to handle the contract interaction
      const response = await supabase.functions.invoke('skill-staking', {
        body: { 
          action: 'joinPool',
          poolId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-pools"] });
      
      toast({
        title: "Joined pool successfully",
        description: "You have successfully joined the revenue sharing pool.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join pool",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Withdraw earnings
  const withdrawEarnings = useMutation({
    mutationFn: async (poolId: string) => {
      if (!user) throw new Error("User must be logged in to withdraw earnings");
      
      // Ensure wallet is connected
      if (!wallet) {
        await connectWallet();
      }
      
      // This would call a Supabase function to handle the contract interaction
      const response = await supabase.functions.invoke('skill-staking', {
        body: { 
          action: 'withdrawEarnings',
          poolId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-pools"] });
      queryClient.invalidateQueries({ queryKey: ["staking-transactions"] });
      
      toast({
        title: "Withdrawal successful",
        description: "Your earnings have been successfully withdrawn.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to withdraw earnings",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Process the stakes data for displaying in charts
  const stakedSkillsData = userStakes ? userStakes.reduce((acc: StakedSkillData[], stake) => {
    const existingCategory = acc.find(item => item.category === stake.skill_category);
    
    if (existingCategory) {
      existingCategory.amount += stake.amount_usdc;
    } else {
      acc.push({
        category: stake.skill_category,
        amount: stake.amount_usdc
      });
    }
    
    return acc;
  }, []) : [];
  
  // Calculate totals
  const totalStakedValue = userStakes?.reduce((sum, stake) => sum + stake.amount_usdc, 0) || 0;
  
  // This would be calculated from actual earnings data
  // Mocked for now
  const totalEarnings = transactions
    ?.filter(tx => tx.type === 'earn')
    .reduce((sum, tx) => sum + tx.amount, 0) || 0;
  
  // Generate mock historical data for charts
  const generateHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      date: month,
      earnings: Math.random() * 10 + 2 * i // Random increasing earnings
    }));
  };
  
  const stakingHistoryData = generateHistoricalData();
  
  // Combine loading states and errors
  const isLoading = stakesLoading || txLoading || poolsLoading;
  const error = stakesError || txError || poolsError;
  
  return {
    userStakes,
    totalStakedValue,
    totalEarnings,
    stakedSkillsData,
    stakingHistoryData,
    transactions,
    revenuePools,
    isLoading,
    error,
    createStake,
    joinPool,
    withdrawEarnings
  };
}
