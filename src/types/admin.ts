
export type AdminRole = 'super_admin' | 'system_admin' | 'support_admin' | 'finance_admin';

export interface AdminUser {
  id: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  time_period: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  payment_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: string;
  completed_steps: string[];
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
