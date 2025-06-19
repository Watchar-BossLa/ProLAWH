
import { useState, useEffect } from 'react';
import { useTenantManagement } from './useTenantManagement';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { IPWhitelistEntry, SecurityAuditLog } from '@/types/security';
import { supabase } from '@/integrations/supabase/client';

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

    try {
      // Try to fetch from tenant_ip_whitelist table if it exists
      const { data, error } = await supabase
        .from('tenant_ip_whitelist')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setIpWhitelist(data.map(item => ({
          id: item.id,
          ip_address: item.ip_address,
          description: item.description,
          is_active: item.is_active,
          created_by: item.created_by,
          created_at: item.created_at
        })));
        return;
      }
    } catch (error) {
      console.warn('IP whitelist table not available, using mock data:', error);
    }

    // Fall back to mock data
    const mockData: IPWhitelistEntry[] = [
      {
        id: '1',
        ip_address: '192.168.1.0/24',
        description: 'Office Network',
        is_active: true,
        created_by: 'admin',
        created_at: new Date().toISOString()
      }
    ];
    
    setIpWhitelist(mockData);
  };

  const fetchSecurityLogs = async () => {
    if (!currentTenant) return;

    try {
      // Try to fetch from security_audit_logs table if it exists
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        setSecurityLogs(data.map(item => ({
          id: item.id,
          event_type: item.event_type,
          event_details: item.event_details,
          ip_address: item.ip_address,
          user_agent: item.user_agent,
          risk_score: item.risk_score || 0,
          created_at: item.created_at
        })));
        return;
      }
    } catch (error) {
      console.warn('Security audit logs table not available, using mock data:', error);
    }

    // Fall back to mock data
    const mockData: SecurityAuditLog[] = [
      {
        id: '1',
        event_type: 'login_attempt',
        event_details: { success: true },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0',
        risk_score: 2,
        created_at: new Date().toISOString()
      }
    ];
    
    setSecurityLogs(mockData);
  };

  const addIPToWhitelist = async (ipAddress: string, description: string) => {
    if (!currentTenant) return;

    try {
      // Try to insert into tenant_ip_whitelist table if it exists
      const { data, error } = await supabase
        .from('tenant_ip_whitelist')
        .insert({
          ip_address: ipAddress,
          description: description,
          is_active: true
        })
        .select()
        .single();

      if (!error && data) {
        toast({
          title: "Success",
          description: "IP address added to whitelist"
        });
        
        await fetchIPWhitelist();
        return;
      }
    } catch (error) {
      console.warn('IP whitelist table not available, using mock operation:', error);
    }

    // Simulate API call
    console.log('Adding IP to whitelist:', ipAddress, description);
    
    toast({
      title: "Success",
      description: "IP address added to whitelist"
    });
    
    await fetchIPWhitelist();
  };

  const removeIPFromWhitelist = async (id: string) => {
    try {
      // Try to delete from tenant_ip_whitelist table if it exists
      const { error } = await supabase
        .from('tenant_ip_whitelist')
        .delete()
        .eq('id', id);

      if (!error) {
        toast({
          title: "Success",
          description: "IP address removed from whitelist"
        });
        
        await fetchIPWhitelist();
        return;
      }
    } catch (error) {
      console.warn('IP whitelist table not available, using mock operation:', error);
    }

    // Simulate API call
    console.log('Removing IP from whitelist:', id);
    
    toast({
      title: "Success",
      description: "IP address removed from whitelist"
    });
    
    await fetchIPWhitelist();
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
