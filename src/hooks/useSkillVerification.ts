
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";
import { useGreenSkills } from "@/hooks/useGreenSkills";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type VerificationMethod = 'challenge' | 'credential' | 'endorsement';

interface VerificationData {
  skillId: string;
  method: VerificationMethod;
  evidence?: File | string;
  notes?: string;
}

export function useSkillVerification() {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const queryClient = useQueryClient();
  const { data: skills = [] } = useGreenSkills();
  const { issueCredential } = useBlockchainCredentials(user?.id);
  
  const verifySkill = useMutation({
    mutationFn: async (data: VerificationData) => {
      if (!user) throw new Error("You must be logged in to verify a skill");
      setIsVerifying(true);
      
      try {
        let evidenceUrl = "";
        
        // If evidence is a file, upload it
        if (data.evidence instanceof File) {
          const fileExt = data.evidence.name.split('.').pop();
          const filePath = `${user.id}/verifications/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('skill-verifications')
            .upload(filePath, data.evidence);
            
          if (uploadError) throw uploadError;
          
          const { data: fileData } = supabase.storage
            .from('skill-verifications')
            .getPublicUrl(filePath);
            
          evidenceUrl = fileData.publicUrl;
        } else if (typeof data.evidence === 'string') {
          evidenceUrl = data.evidence;
        }
        
        // Create a verification record
        const { data: verificationData, error: verificationError } = await supabase
          .from('skill_verifications')
          .insert({
            user_skill_id: user.id, // This assumes user_skill_id matches the user ID
            verification_type: data.method,
            verification_source: data.method === 'credential' ? 'upload' : 
                               data.method === 'endorsement' ? 'peer' : 'challenge',
            verification_evidence: evidenceUrl,
            verification_score: data.method === 'challenge' ? 100 : 80
          })
          .select()
          .single();
          
        if (verificationError) throw verificationError;
        
        // Issue a blockchain credential
        const skill = skills.find(s => s.id === data.skillId);
        if (!skill) throw new Error("Skill not found");
        
        await issueCredential.mutateAsync({
          skillId: data.skillId,
          metadata: {
            issuer: "ProLawh",
            verification_method: data.method,
            achievement_level: "Verified",
            verification_proof: evidenceUrl || "Internal verification"
          }
        });
        
        return verificationData;
      } finally {
        setIsVerifying(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['blockchain-credentials'] });
      
      toast({
        title: "Skill verified successfully",
        description: "Your green skill has been verified and added to your credentials",
      });
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Failed to verify skill",
        variant: "destructive"
      });
    }
  });

  return {
    verifySkill,
    isVerifying
  };
}
