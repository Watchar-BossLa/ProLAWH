
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  riskScore: number;
  flags: string[];
}

export type SecurityEventType = 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'rate_limit' | 'injection_attempt' | 'dom_tampering' | 'api_abuse' | 'input_validation_failed' | 'csp_missing' | 'session_validation_failed' | 'bulk_data_access' | 'excessive_data_access' | 'rapid_user_actions' | 'high_memory_usage' | 'security_header_missing' | 'role_access' | 'admin_access';
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  context: SecurityContext;
  timestamp?: string;
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
