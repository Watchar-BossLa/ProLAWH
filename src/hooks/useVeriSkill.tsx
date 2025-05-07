
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './useAuth';

interface VeriSkillContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connectWallet: () => Promise<void>; // Updated to match implementation below
  disconnectWallet: () => void;
  verifySkill: (skillId: string) => Promise<boolean>;
  walletAddress: string | null;
}

const VeriSkillContext = createContext<VeriSkillContextType | undefined>(undefined);

export function VeriSkillProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, this would connect to a blockchain wallet
      // For now, just simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAddress = "0x" + Math.random().toString(16).slice(2, 12);
      setWalletAddress(mockAddress);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  const verifySkill = async (skillId: string): Promise<boolean> => {
    if (!user || !isConnected) {
      setError(new Error('User must be logged in and wallet connected'));
      return false;
    }

    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, this would interact with a blockchain
      // For now, just simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to verify skill'));
      console.error('Skill verification error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: VeriSkillContextType = {
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    verifySkill,
    walletAddress
  };

  return (
    <VeriSkillContext.Provider value={value}>
      {children}
    </VeriSkillContext.Provider>
  );
}

export function useVeriSkill() {
  const context = useContext(VeriSkillContext);
  if (context === undefined) {
    throw new Error('useVeriSkill must be used within a VeriSkillProvider');
  }
  return context;
}
