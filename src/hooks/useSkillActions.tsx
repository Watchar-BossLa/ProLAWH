
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { SkillStake } from "@/types/staking";

interface UseSkillActionsProps {
  userId: string | undefined;
  walletConnected: boolean;
}

interface UseSkillActionsReturn {
  verifySkill: (skillId: string, evidenceUrl: string) => Promise<boolean>;
  stakeSkill: (stake: Omit<SkillStake, "id">) => Promise<boolean>;
  activeStakes: SkillStake[];
  isLoading: boolean;
  error: Error | null;
}

export function useSkillActions({ userId, walletConnected }: UseSkillActionsProps): UseSkillActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeStakes, setActiveStakes] = useState<SkillStake[]>([]);
  
  // Load user's active stakes
  useEffect(() => {
    if (userId) {
      fetchActiveStakes();
    }
  }, [userId]);
  
  const fetchActiveStakes = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('active_stakes')
        .select('*')
        .eq('user_id', userId)
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
  
  const verifySkill = async (skillId: string, evidenceUrl: string) => {
    if (!userId) {
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
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .single();
        
      if (skillError) {
        // User doesn't have this skill yet, let's insert it
        const { data: newSkill, error: insertError } = await supabase
          .from('user_skills')
          .insert({
            user_id: userId,
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
    if (!userId) {
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
          user_id: userId,
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

  return {
    verifySkill,
    stakeSkill,
    activeStakes,
    isLoading,
    error
  };
}
