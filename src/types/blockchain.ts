
export interface BlockchainCredential {
  id: string;
  user_id: string;
  skill_id: string;
  issued_at: string;
  expires_at?: string;
  metadata?: any;
  is_verified: boolean;
  credential_type: string;
  credential_hash: string;
  transaction_id: string;
  skills?: {
    name: string;
  };
}
