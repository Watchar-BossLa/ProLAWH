
export interface IPWhitelistEntry {
  id: string;
  ip_address: string;
  description?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export interface SecurityAuditLog {
  id: string;
  event_type: string;
  event_details: any;
  ip_address?: string;
  user_agent?: string;
  risk_score: number;
  created_at: string;
}
