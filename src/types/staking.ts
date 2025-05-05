
export interface StakingContract {
  id: string;
  contract_address: string;
  network: string;
}

export interface SkillStake {
  id?: string;
  skill_id: string;
  amount_usdc: number;
  user_id: string;
  polygon_tx_hash?: string;
  polygon_contract_address?: string;
  stake_token_amount?: number;
  status?: "active" | "completed" | "withdrawn" | "cancelled";
  poolId?: string;
  skill_name?: string;
  skill_category?: string;
  started_at?: string;
  ends_at?: string | null;
}
