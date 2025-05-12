
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface BlockchainCredential {
  id: string;
  user_id: string;
  skill_id: string;
  issued_at: string;
  expires_at: string | null;
  credential_type: string;
  credential_hash: string;
  transaction_id: string;
  is_verified: boolean;
  metadata: {
    issuer?: string;
    verification_method?: string;
    achievement_level?: string;
    verification_proof?: string;
  } | null;
}

export function useBlockchainCredentials(userId?: string) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: credentials, isLoading } = useQuery({
    queryKey: ['blockchain-credentials', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('blockchain_credentials')
        .select('*, skills(name, category)')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const verifyCredential = useMutation({
    mutationFn: async (credentialId: string) => {
      setLoading(true);
      try {
        // Simulate blockchain verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data, error } = await supabase
          .from('blockchain_credentials')
          .update({ is_verified: true })
          .eq('id', credentialId)
          .select();
        
        if (error) throw error;
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-credentials'] });
      toast({
        title: "Credential Verified",
        description: "Your skill credential has been verified on the blockchain",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify credential",
        variant: "destructive"
      });
    }
  });

  const issueCredential = useMutation({
    mutationFn: async (params: {
      skillId: string;
      metadata: any;
    }) => {
      setLoading(true);
      try {
        if (!userId) throw new Error("User not authenticated");
        
        // Generate mock blockchain data
        const mockTransactionId = `tx_${Math.random().toString(36).substring(2, 15)}`;
        const mockHash = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        const { data, error } = await supabase
          .from('blockchain_credentials')
          .insert({
            user_id: userId,
            skill_id: params.skillId,
            credential_type: 'polygon',
            credential_hash: mockHash,
            transaction_id: mockTransactionId,
            is_verified: false,
            metadata: params.metadata
          })
          .select();
        
        if (error) throw error;
        return data;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchain-credentials'] });
      toast({
        title: "Credential Issued",
        description: "Your skill has been issued as a credential on the blockchain",
      });
    },
    onError: (error) => {
      toast({
        title: "Issue Failed",
        description: error instanceof Error ? error.message : "Failed to issue credential",
        variant: "destructive"
      });
    }
  });

  return {
    credentials,
    isLoading: isLoading || loading,
    verifyCredential,
    issueCredential
  };
}
