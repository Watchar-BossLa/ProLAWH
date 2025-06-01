
export interface DeviceSession {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ip_address: string;
  location?: string;
  is_current: boolean;
  last_activity: string;
  created_at: string;
  expires_at: string;
}

export interface DeviceInfo {
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  device_name: string;
}
