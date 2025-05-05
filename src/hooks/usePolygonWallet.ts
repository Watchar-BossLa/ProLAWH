
import { useState, useEffect, useCallback } from "react";
import { polygonClient } from "@/integrations/polygon/client";
import { toast } from "@/hooks/use-toast";

export function usePolygonWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Add a wallet property to match the usage in useSkillStaking.ts
  const wallet = address ? { address } : null;

  // Connect to wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const walletAddress = await polygonClient.connectWallet();
      setAddress(walletAddress);
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
      return walletAddress;
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Add connectWallet function as an alias to connect for compatibility
  const connectWallet = connect;

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setIsConnected(false);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
          });
        } else {
          setAddress(accounts[0]);
          toast({
            title: "Account Changed",
            description: `Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        }
      });
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    connectWallet,
    wallet
  };
}
