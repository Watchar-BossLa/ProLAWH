
/**
 * VeriSkill Network Platform Types
 */

export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  proof: CredentialProof;
}

export interface CredentialProof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws?: string;
  proofValue?: string;
}

export interface DigitalWallet {
  did: string;
  keyType: 'Ed25519' | 'Secp256k1';
  publicKeyMultibase: string;
  recoveryShards: number;
  createdAt: string;
  lastBackup?: string;
}

export interface GigOpportunity {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: {
    amount: number;
    currency: 'USDC' | 'DAI' | 'USDT';
  };
  duration: {
    estimatedHours: number;
    deadline?: string;
  };
  client: {
    id: string;
    name: string;
    rating?: number;
  };
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    country?: string;
    timezone?: string[];
  };
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEscrow {
  id: string;
  opportunityId: string;
  amount: number;
  currency: 'USDC' | 'DAI' | 'USDT';
  status: 'funded' | 'released' | 'disputed' | 'refunded';
  clientId: string;
  providerId: string;
  transactionHash?: string;
  chainId: number;
  milestones?: {
    id: string;
    description: string;
    amount: number;
    status: 'pending' | 'approved' | 'released';
    dueDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface TalentMatch {
  talentId: string;
  opportunityId: string;
  matchScore: number;
  skillMatchDetails: {
    skill: string;
    confidence: number;
  }[];
  issuedAt: string;
}

export interface SkillPassport {
  did: string;
  credentials: VerifiableCredential[];
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    verificationStatus: 'verified' | 'pending' | 'unverified';
    credentialIds: string[];
  }[];
  profile: {
    name?: string;
    bio?: string;
    profilePicture?: string;
  };
}

export interface VeriSkillPlatformConfig {
  apiEndpoint: string;
  embedMode: boolean;
  authToken?: string;
  useTestnet?: boolean;
  features: {
    wallet: boolean;
    marketplace: boolean;
    credentials: boolean;
    payments: boolean;
  };
}

export interface VeriSkillMessage {
  type: 'VS_LOADED' | 'VS_ERROR' | 'VS_NOTIFICATION' | 'VS_AUTH_REQUEST' | 'VS_AUTH_RESPONSE';
  payload: {
    message?: string;
    title?: string;
    code?: string;
    data?: any;
  };
}
