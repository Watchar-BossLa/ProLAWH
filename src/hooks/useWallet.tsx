
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UseWalletReturn {
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  walletConnected: boolean;
  walletAddress: string | null;
  isLoading: boolean;
}

export function useWallet(): UseWalletReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
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

  return {
    connectWallet,
    disconnectWallet,
    walletConnected,
    walletAddress,
    isLoading
  };
}
