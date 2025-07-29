
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  riskScore: number;
  flags: string[];
}

export type SecurityEventType = 
  | 'authentication' 
  | 'authorization' 
  | 'data_access' 
  | 'system' 
  | 'error'
  | 'injection_attempt'
  | 'suspicious_activity'
  | 'rate_limit';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  context: SecurityContext;
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

export interface SecurityMetrics {
  totalEvents: number;
  eventsBySeverity: Record<string, number>;
  eventsByType: Record<string, number>;
  recentEvents: SecurityEvent[];
}

export interface SessionInfo {
  userId?: string;
  sessionId?: string;
  expiresAt?: string;
  isValid: boolean;
}

export interface SecurityAlert {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}
