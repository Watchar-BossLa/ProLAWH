
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { 
  submitVerification, 
  getSkillVerifications,
  endorseSkill,
  getSkillEndorsements,
  VerificationRequest,
  SkillVerification,
  SkillEndorsement
} from '@/services/skillVerificationService';

// Add this export type for VerificationMethod
export type VerificationMethod = 'challenge' | 'credential' | 'endorsement';

export function useSkillVerification(userSkillId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVerificationType, setSelectedVerificationType] = useState<string>('assessment');

  // Fetch verifications for a skill
  const {
    data: verifications,
    isLoading: isLoadingVerifications
  } = useQuery({
    queryKey: ['skillVerifications', userSkillId],
    queryFn: async () => {
      if (!userSkillId) return [];
      const result = await getSkillVerifications(userSkillId);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data || [];
    },
    enabled: !!userSkillId,
  });

  // Fetch endorsements for a skill
  const fetchEndorsements = async (userId: string, skillId: string): Promise<SkillEndorsement[]> => {
    const result = await getSkillEndorsements(userId, skillId);
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data || [];
  };

  // Submit a verification
  const verificationMutation = useMutation({
    mutationFn: (data: VerificationRequest) => submitVerification(data),
    onSuccess: () => {
      toast({
        title: "Verification submitted",
        description: "Your skill verification has been submitted successfully",
      });
      if (userSkillId) {
        queryClient.invalidateQueries({ queryKey: ['skillVerifications', userSkillId] });
        queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Endorse a skill
  const endorseMutation = useMutation({
    mutationFn: ({ skillId, userId, comment }: { skillId: string; userId: string; comment?: string }) => {
      if (!user) throw new Error("User not authenticated");
      return endorseSkill(skillId, userId, user.id, comment);
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Skill endorsed",
        description: "You have successfully endorsed this skill",
      });
      queryClient.invalidateQueries({ 
        queryKey: ['skillEndorsements', variables.userId, variables.skillId] 
      });
    },
    onError: (error) => {
      toast({
        title: "Endorsement failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  const submitSkillVerification = async (data: Omit<VerificationRequest, 'userSkillId'>): Promise<void> => {
    const verificationData: VerificationRequest = {
      ...data,
      userSkillId
    };

    const result = await verificationMutation.mutateAsync(verificationData);
    
    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  const endorseUserSkill = async (skillId: string, userId: string, comment?: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to endorse skills",
        variant: "destructive",
      });
      return;
    }

    await endorseMutation.mutateAsync({ skillId, userId, comment });
  };

  return {
    verifications,
    isLoadingVerifications,
    isSubmittingVerification: verificationMutation.isPending,
    isSubmittingEndorsement: endorseMutation.isPending,
    submitVerification: submitSkillVerification,
    endorseSkill: endorseUserSkill,
    fetchEndorsements,
    selectedVerificationType,
    setSelectedVerificationType
  };
}
