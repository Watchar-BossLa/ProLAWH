
export type VerificationMethod = "challenge" | "credential" | "endorsement";

export interface SkillVerification {
  id: string;
  user_skill_id: string;
  verification_score?: number;
  verified_by?: string;
  created_at: string;
  expires_at?: string;
  verification_type: string;
  verification_source: string;
  verification_evidence?: string;
}
