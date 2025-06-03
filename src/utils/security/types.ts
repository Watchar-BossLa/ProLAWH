
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  riskScore: number;
  flags: string[];
}

export type SecurityEventType = 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'rate_limit' | 'injection_attempt';
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  context: SecurityContext;
  metadata?: Record<string, any>;
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
