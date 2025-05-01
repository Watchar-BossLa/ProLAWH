
import { supabase } from "@/integrations/supabase/client";
import { AsyncResult } from "@/types/utility";

export interface VerificationRequest {
  userSkillId: string;
  type: 'assessment' | 'peer_review' | 'blockchain' | 'certificate';
  source: string;
  evidence?: string;
}

export interface SkillVerification {
  id: string;
  user_skill_id: string;
  verification_type: string;
  verification_source: string;
  verification_score?: number;
  verification_evidence?: string;
  verified_by?: string;
  created_at: string;
  expires_at?: string;
}

export interface SkillEndorsement {
  id: string;
  skill_id: string;
  user_id: string;
  endorser_id: string;
  comment?: string;
  created_at: string;
}

/**
 * Submit a verification request for a skill
 */
export async function submitVerification(data: VerificationRequest): Promise<AsyncResult<SkillVerification>> {
  try {
    const { data: verification, error } = await supabase
      .from('skill_verifications')
      .insert({
        user_skill_id: data.userSkillId,
        verification_type: data.type,
        verification_source: data.source,
        verification_evidence: data.evidence,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the user_skill as verified
    const { error: updateError } = await supabase
      .from('user_skills')
      .update({ is_verified: true, verification_date: new Date().toISOString() })
      .eq('id', data.userSkillId);

    if (updateError) {
      throw updateError;
    }

    return { data: verification, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: error instanceof Error ? error.name : undefined
      } 
    };
  }
}

/**
 * Endorse a user's skill
 */
export async function endorseSkill(
  skillId: string, 
  userId: string, 
  endorserId: string, 
  comment?: string
): Promise<AsyncResult<SkillEndorsement>> {
  try {
    const { data: endorsement, error } = await supabase
      .from('skill_endorsements')
      .insert({
        skill_id: skillId,
        user_id: userId,
        endorser_id: endorserId,
        comment
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: endorsement, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: error instanceof Error ? error.name : undefined
      } 
    };
  }
}

/**
 * Get all verifications for a user's skill
 */
export async function getSkillVerifications(userSkillId: string): Promise<AsyncResult<SkillVerification[]>> {
  try {
    const { data, error } = await supabase
      .from('skill_verifications')
      .select('*')
      .eq('user_skill_id', userSkillId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: error instanceof Error ? error.name : undefined
      } 
    };
  }
}

/**
 * Get all endorsements for a user's skill
 */
export async function getSkillEndorsements(userId: string, skillId: string): Promise<AsyncResult<SkillEndorsement[]>> {
  try {
    const { data, error } = await supabase
      .from('skill_endorsements')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: error instanceof Error ? error.name : undefined
      } 
    };
  }
}
