
import { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useSkillActions } from "@/hooks/useSkillActions";
import { useChallenges } from "@/hooks/useChallenges";
import type { SkillStake } from "@/types/staking";
import type { ChallengeResult } from "@/types/arcade";

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
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize modular hooks
  const wallet = useWallet();
  
  const skillActions = useSkillActions({
    userId: user?.id,
    walletConnected: wallet.walletConnected
  });
  
  const challenges = useChallenges({
    userId: user?.id
  });
  
  // Determine if any of our hooks is in a loading state
  const isLoading = wallet.isLoading || skillActions.isLoading || challenges.isLoading;
  
  // Collect any errors from our hooks
  if (skillActions.error && !error) setError(skillActions.error);
  if (challenges.error && !error) setError(challenges.error);

  return (
    <VeriSkillContext.Provider value={{
      isLoading,
      error,
      
      // Skill verification & staking
      verifySkill: skillActions.verifySkill,
      stakeSkill: skillActions.stakeSkill,
      activeStakes: skillActions.activeStakes,
      
      // Challenges
      submitChallengeResult: challenges.submitChallengeResult,
      userChallenges: challenges.userChallenges,
      
      // Wallet
      connectWallet: wallet.connectWallet,
      disconnectWallet: wallet.disconnectWallet,
      walletConnected: wallet.walletConnected,
      walletAddress: wallet.walletAddress
    }}>
      {children}
    </VeriSkillContext.Provider>
  );
};

export const useVeriSkill = () => {
  return useContext(VeriSkillContext);
};
