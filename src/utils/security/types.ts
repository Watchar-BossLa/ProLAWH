
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  riskScore: number;
  flags: string[];
}

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'suspicious_activity' | 'rate_limit' | 'injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
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
