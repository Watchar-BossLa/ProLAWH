
export interface ActivityLog {
  id: string;
  activity_type: string;
  created_at: string;
  user_id: string;
  metadata: any; 
}

export interface ActivityLogWithOptionals {
  id: string;
  activity_type?: string;
  created_at?: string;
  user_id?: string;
  metadata?: any;
}
