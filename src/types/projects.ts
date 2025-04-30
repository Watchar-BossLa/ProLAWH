
export interface GreenProject {
  id: string;
  title: string;
  description: string;
  category: string;
  skillsNeeded: string[];
  teamSize?: number;
  duration?: string;
  impactArea?: string;
  location?: string;
  deadline?: string;
  carbonReduction?: number;
  sdgAlignment?: string[];
  compensation?: string;
  hasInsurance?: boolean;
  insuranceDetails?: Record<string, string>;
  createdBy?: string | null;
  status?: string;
}

export interface ProjectApplication {
  id: string;
  userId: string;
  projectId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  appliedAt: string;
}

export interface SkillStake {
  id: string;
  userId: string;
  projectId: string;
  credentialId: string;
  amount: number;
  startedAt: string;
  endsAt?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ProjectInsurance {
  projectId: string;
  provider: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate?: string;
  policyDetails: Record<string, any>;
}

export interface BiasShieldMetrics {
  equalOpportunity: number;
  demographicParity: number;
  biasScore: number;
  timestamp: string;
  matchId: string;
}
