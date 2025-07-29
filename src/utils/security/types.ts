
export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context: {
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
    riskScore: number;
    flags: string[];
  };
  metadata?: Record<string, any>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (context: any) => string;
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'url' | 'json';
  required?: boolean;
  maxLength?: number;
  pattern?: RegExp;
}

export interface IPWhitelistEntry {
  id: string;
  ip_address: string;
  description: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface SecurityAuditLog {
  id: string;
  event_type: string;
  event_details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  risk_score: number;
  created_at: string;
}
