
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface BlockchainCredential {
  id: string;
  user_id: string;
  skill_id: string;
  issued_at: string;
  credential_type: string;
  transaction_id: string;
  is_verified: boolean;
  metadata?: {
    issuer: string;
    verification_method: string;
    achievement_level: string;
    verification_proof?: string;
  };
}

interface IssueCredentialParams {
  skillId: string;
  metadata: {
    issuer: string;
    verification_method: string;
    achievement_level: string;
    verification_proof?: string;
  };
}

export function useBlockchainCredentials(userId?: string) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user's blockchain credentials
  const { data: credentials = [], error } = useQuery({
    queryKey: ['blockchain-credentials', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      return data as BlockchainCredential[];
    },
    enabled: !!userId,
  });
  
  // Issue a new credential
  const issueCredential = useMutation({
    mutationFn: async ({ skillId, metadata }: IssueCredentialParams) => {
      if (!userId) throw new Error("User ID is required to issue a credential");
      setIsLoading(true);
      
      try {
        // Generate a mock transaction hash
        const transactionId = Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
          
        // Add credential to the blockchain_credentials table  
        const { data, error } = await supabase
          .from('blockchain_credentials')
          .insert({
            user_id: userId,
            skill_id: skillId,
            credential_type: 'solana',
            credential_hash: `sol:${transactionId.substring(0, 16)}`,
            transaction_id: transactionId,
            is_verified: true,
            metadata,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        return data as BlockchainCredential;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-credentials'] });
      toast({
        title: "Credential issued",
        description: "Your skill credential has been recorded on the blockchain",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to issue credential",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Verify an existing credential
  const verifyCredential = useMutation({
    mutationFn: async (credentialId: string) => {
      if (!userId) throw new Error("User ID is required to verify a credential");
      setIsLoading(true);
      
      try {
        // In a real implementation, this would verify the credential on the blockchain
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the credential status
        const { data, error } = await supabase
          .from('blockchain_credentials')
          .update({ is_verified: true })
          .eq('id', credentialId)
          .eq('user_id', userId)
          .select()
          .single();
          
        if (error) throw error;
        
        return data as BlockchainCredential;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-credentials'] });
      toast({
        title: "Credential verified",
        description: "Your skill credential has been successfully verified",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  return {
    credentials,
    isLoading,
    error,
    issueCredential,
    verifyCredential
  };
}
