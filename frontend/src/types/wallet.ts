
export interface DigitalIdentity {
  did: string;
  keyPair: {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  };
  keyType: 'Ed25519';
  createdAt: string;
  recoveryShards?: string[];
}

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
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
}

export interface WalletState {
  identity: DigitalIdentity | null;
  credentials: VerifiableCredential[];
  isLocked: boolean;
  isInitialized: boolean;
}

export interface RecoveryShare {
  index: number;
  share: string;
  threshold: number;
  total: number;
}
