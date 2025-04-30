
import { supabase } from "@/integrations/supabase/client";

export interface StakeData {
  userId: string;
  projectId: string;
  credentialId: string;
  amount: number;
}

export interface InsuranceQuote {
  premium: number;
  coverage: number;
  duration: string;
  provider: string;
}

/**
 * Creates a new stake for a user on a specific project
 */
export async function createStake(data: StakeData): Promise<void> {
  const { error } = await supabase
    .from('skill_stakes')
    .insert({
      user_id: data.userId,
      skill_id: data.credentialId, // Using skill_id as required by the database
      amount_usdc: data.amount,
      status: 'active'
      // Note: project_id is not in the skill_stakes table schema
    });

  if (error) {
    throw new Error(`Error creating stake: ${error.message}`);
  }
}

/**
 * Fetch active stakes for a user
 */
export async function fetchUserStakes(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('skill_stakes')
    .select(`
      *,
      skills:skill_id (name, description)
    `)
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) {
    throw new Error(`Error fetching stakes: ${error.message}`);
  }

  return data || [];
}

/**
 * Get an insurance quote for a project
 */
export async function getInsuranceQuote(projectId: string, amount: number): Promise<InsuranceQuote> {
  // In a real implementation, this would call an InsurTech API
  // For now, we'll return a mock quote
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    premium: amount * 0.05, // 5% of staked amount
    coverage: amount * 2, // 2x coverage
    duration: "Duration of project",
    provider: "CoverGenius"
  };
}
