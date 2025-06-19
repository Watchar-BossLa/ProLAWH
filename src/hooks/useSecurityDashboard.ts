
import { useState, useEffect } from 'react';
import { useTenantManagement } from './useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { IPWhitelistEntry, SecurityAuditLog } from '@/types/security';

export function useSecurityDashboard() {
  const { currentTenant, hasPermission } = useTenantManagement();
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelistEntry[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);
  const [canManageSecurity, setCanManageSecurity] = useState(false);

  useEffect(() => {
    if (currentTenant) {
      checkPermissions();
      fetchIPWhitelist();
      fetchSecurityLogs();
    }
  }, [currentTenant]);

  const checkPermissions = async () => {
    const canManage = await hasPermission('admin');
    setCanManageSecurity(canManage);
  };

  const fetchIPWhitelist = async () => {
    if (!currentTenant) return;

    // Use mock data since tables don't exist yet
    const mockData: IPWhitelistEntry[] = [
      {
        id: '1',
        ip_address: '192.168.1.0/24',
        description: 'Office Network',
        is_active: true,
        created_by: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        ip_address: '10.0.0.0/8',
        description: 'Internal Network',
        is_active: true,
        created_by: 'admin',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    setIpWhitelist(mockData);
  };

  const fetchSecurityLogs = async () => {
    if (!currentTenant) return;

    // Use mock data since tables don't exist yet
    const mockData: SecurityAuditLog[] = [
      {
        id: '1',
        event_type: 'login_attempt',
        event_details: { success: true, method: 'password' },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        risk_score: 2,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        event_type: 'login_failure',
        event_details: { success: false, reason: 'invalid_password' },
        ip_address: '203.0.113.45',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        risk_score: 7,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        event_type: 'permission_denied',
        event_details: { resource: 'admin_panel', action: 'access' },
        ip_address: '198.51.100.23',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        risk_score: 5,
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    
    setSecurityLogs(mockData);
  };

  const addIPToWhitelist = async (ipAddress: string, description: string) => {
    if (!currentTenant) return;

    // Simulate API call with mock data
    console.log('Adding IP to whitelist:', ipAddress, description);
    
    const newEntry: IPWhitelistEntry = {
      id: Date.now().toString(),
      ip_address: ipAddress,
      description: description,
      is_active: true,
      created_by: 'current_user',
      created_at: new Date().toISOString()
    };

    setIpWhitelist(prev => [...prev, newEntry]);
    
    toast({
      title: "Success",
      description: "IP address added to whitelist"
    });
  };

  const removeIPFromWhitelist = async (id: string) => {
    // Simulate API call with mock data
    console.log('Removing IP from whitelist:', id);
    
    setIpWhitelist(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Success",
      description: "IP address removed from whitelist"
    });
  };

  return {
    ipWhitelist,
    securityLogs,
    canManageSecurity,
    addIPToWhitelist,
    removeIPFromWhitelist,
    refreshData: () => {
      fetchIPWhitelist();
      fetchSecurityLogs();
    }
  };
}
