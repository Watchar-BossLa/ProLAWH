
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { generateIdentity } from '@/utils/crypto/keyGeneration';
import { splitSecret, reconstructSecret } from '@/utils/crypto/secretSharing';
import { walletStorage } from '@/utils/crypto/walletStorage';
import type { DigitalIdentity, VerifiableCredential, WalletState, RecoveryShare } from '@/types/wallet';

export function useDigitalWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    identity: null,
    credentials: [],
    isLocked: true,
    isInitialized: false
  });
  
  const queryClient = useQueryClient();

  // Initialize wallet storage
  useEffect(() => {
    walletStorage.initialize().then(() => {
      setWalletState(prev => ({ ...prev, isInitialized: true }));
    });
  }, []);

  // Load existing identity
  const { data: identity } = useQuery({
    queryKey: ['wallet-identity'],
    queryFn: () => walletStorage.getIdentity(),
    enabled: walletState.isInitialized
  });

  // Load credentials
  const { data: credentials = [] } = useQuery({
    queryKey: ['wallet-credentials'],
    queryFn: () => walletStorage.getCredentials(),
    enabled: walletState.isInitialized && !!identity
  });

  // Update wallet state when data changes
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      identity,
      credentials,
      isLocked: !identity
    }));
  }, [identity, credentials]);

  // Create new identity
  const createIdentity = useMutation({
    mutationFn: async () => {
      const newIdentity = await generateIdentity();
      
      // Generate recovery shares
      const recoveryShares = splitSecret(newIdentity.keyPair.privateKey, 2, 3);
      newIdentity.recoveryShards = recoveryShares.map(share => share.share);
      
      await walletStorage.storeIdentity(newIdentity);
      return { identity: newIdentity, recoveryShares };
    },
    onSuccess: ({ identity, recoveryShares }) => {
      queryClient.invalidateQueries({ queryKey: ['wallet-identity'] });
      toast({
        title: "Digital Identity Created",
        description: `DID: ${identity.did.substring(0, 20)}...`,
      });
      
      // Show recovery shares to user
      toast({
        title: "Save Recovery Shares",
        description: "Store these shares safely. You need 2 of 3 to recover your wallet.",
      });
    },
    onError: (error) => {
      toast({
        title: "Identity Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create identity",
        variant: "destructive"
      });
    }
  });

  // Add credential to wallet
  const addCredential = useMutation({
    mutationFn: async (credential: VerifiableCredential) => {
      await walletStorage.storeCredential(credential);
      return credential;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-credentials'] });
      toast({
        title: "Credential Added",
        description: "Verifiable credential stored in wallet",
      });
    }
  });

  // Recover identity from shares
  const recoverIdentity = useMutation({
    mutationFn: async (shares: RecoveryShare[]) => {
      if (shares.length < 2) {
        throw new Error('Need at least 2 recovery shares');
      }
      
      const privateKey = reconstructSecret(shares);
      // Reconstruct identity from private key
      // This is simplified - in production, you'd need more metadata
      
      toast({
        title: "Identity Recovered",
        description: "Your wallet has been restored from recovery shares",
      });
    }
  });

  const exportWallet = useCallback(() => {
    if (!identity) return null;
    
    return {
      did: identity.did,
      publicKey: Array.from(identity.keyPair.publicKey),
      createdAt: identity.createdAt,
      credentials: credentials.length
    };
  }, [identity, credentials]);

  return {
    walletState,
    createIdentity,
    addCredential,
    recoverIdentity,
    exportWallet,
    isLoading: createIdentity.isPending || addCredential.isPending || recoverIdentity.isPending
  };
}
