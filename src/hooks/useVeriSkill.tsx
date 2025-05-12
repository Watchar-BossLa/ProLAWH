
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SkillStake } from "@/types/staking";
import type { Challenge, ChallengeResult } from "@/types/arcade";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface VeriSkillContextType {
  // Core functionality
  isLoading: boolean;
  error: Error | null;
  
  // Skill verification
  verifySkill: (skillId: string, evidenceUrl: string) => Promise<boolean>;
  
  // Skill staking
  stakeSkill: (stake: Omit<SkillStake, "id">) => Promise<boolean>;
  activeStakes: SkillStake[];
  
  // Arcade challenges
  submitChallengeResult: (challengeId: string, result: Partial<ChallengeResult>) => Promise<boolean>;
  userChallenges: {id: string, completedAt: Date | null}[];
  
  // Wallet functionality
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  walletConnected: boolean;
  walletAddress: string | null;
}

const VeriSkillContext = createContext<VeriSkillContextType>({
  isLoading: false,
  error: null,
  verifySkill: async () => false,
  stakeSkill: async () => false,
  activeStakes: [],
  submitChallengeResult: async () => false,
  userChallenges: [],
  connectWallet: async () => false,
  disconnectWallet: () => {},
  walletConnected: false,
  walletAddress: null
});

export const VeriSkillProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeStakes, setActiveStakes] = useState<SkillStake[]>([]);
  const [userChallenges, setUserChallenges] = useState<{id: string, completedAt: Date | null}[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  // Load user's active stakes
  useEffect(() => {
    if (user) {
      fetchActiveStakes();
      fetchUserChallenges();
    }
  }, [user]);
  
  const fetchActiveStakes = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('active_stakes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');
        
      if (error) throw error;
      setActiveStakes(data as SkillStake[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching stakes'));
      console.error("Error fetching active stakes:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserChallenges = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenge_attempts')
        .select('challenge_id, completed_at')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setUserChallenges(data.map(item => ({
        id: item.challenge_id,
        completedAt: item.completed_at ? new Date(item.completed_at) : null
      })));
    } catch (err) {
      console.error("Error fetching user challenges:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifySkill = async (skillId: string, evidenceUrl: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to verify skills",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // First check if the user has this skill
      const { data: userSkills, error: skillError } = await supabase
        .from('user_skills')
        .select('id')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .single();
        
      if (skillError) {
        // User doesn't have this skill yet, let's insert it
        const { data: newSkill, error: insertError } = await supabase
          .from('user_skills')
          .insert({
            user_id: user.id,
            skill_id: skillId,
            proficiency_level: 1,
            is_verified: false
          })
          .select('id')
          .single();
          
        if (insertError) throw insertError;
        
        // Add verification for the new skill
        const { error: verificationError } = await supabase
          .from('skill_verifications')
          .insert({
            user_skill_id: newSkill.id,
            verification_type: 'evidence',
            verification_source: 'user_submitted',
            verification_evidence: evidenceUrl,
            verification_score: 70 // Starting score
          });
          
        if (verificationError) throw verificationError;
      } else {
        // User has this skill, add a new verification
        const { error: verificationError } = await supabase
          .from('skill_verifications')
          .insert({
            user_skill_id: userSkills.id,
            verification_type: 'evidence',
            verification_source: 'user_submitted',
            verification_evidence: evidenceUrl,
            verification_score: 70 // Starting score
          });
          
        if (verificationError) throw verificationError;
      }
      
      toast({
        title: "Verification submitted",
        description: "Your skill verification is being processed",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error verifying skill'));
      console.error("Error verifying skill:", err);
      
      toast({
        title: "Verification failed",
        description: "There was an error submitting your verification",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const stakeSkill = async (stake: Omit<SkillStake, "id">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to stake skills",
        variant: "destructive"
      });
      return false;
    }
    
    if (!walletConnected) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet to stake skills",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Mock polygon transaction hash for demonstration
      const polygonTxHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Insert new stake
      const { error } = await supabase
        .from('skill_stakes')
        .insert({
          ...stake,
          user_id: user.id,
          polygon_tx_hash: polygonTxHash,
          status: 'active',
          started_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Refresh active stakes
      await fetchActiveStakes();
      
      toast({
        title: "Skill staked successfully",
        description: `You've staked ${stake.amount_usdc} USDC on this skill`,
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error staking skill'));
      console.error("Error staking skill:", err);
      
      toast({
        title: "Staking failed",
        description: "There was an error staking your skill",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitChallengeResult = async (challengeId: string, result: Partial<ChallengeResult>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit challenge results",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      // Record challenge attempt
      const { error } = await supabase
        .from('challenge_attempts')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: result.success ? 'completed' : 'failed',
          points_earned: result.points || 0,
          submission_data: { message: result.message },
          completed_at: result.success ? new Date().toISOString() : null
        });
        
      if (error) throw error;
      
      // Refresh challenges
      await fetchUserChallenges();
      
      if (result.success) {
        toast({
          title: "Challenge completed",
          description: `You earned ${result.points} points!`,
        });
      } else {
        toast({
          title: "Challenge failed",
          description: result.message || "Better luck next time",
          variant: "destructive"
        });
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error submitting result'));
      console.error("Error submitting challenge result:", err);
      
      toast({
        title: "Submission failed",
        description: "There was an error recording your results",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Simulating wallet connection for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddress = `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      setWalletConnected(true);
      setWalletAddress(mockAddress);
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`,
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error connecting wallet'));
      console.error("Error connecting wallet:", err);
      
      toast({
        title: "Connection failed",
        description: "Could not connect to wallet",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <VeriSkillContext.Provider value={{
      isLoading,
      error,
      verifySkill,
      stakeSkill,
      activeStakes,
      submitChallengeResult,
      userChallenges,
      connectWallet,
      disconnectWallet,
      walletConnected,
      walletAddress
    }}>
      {children}
    </VeriSkillContext.Provider>
  );
};

export const useVeriSkill = () => {
  return useContext(VeriSkillContext);
};
