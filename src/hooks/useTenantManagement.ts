
import { useState, useEffect } from 'react';
import { useProductionAuth } from '@/components/auth/ProductionAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  settings: Record<string, any>;
  plan_type: string;
  max_users: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  joined_at: string;
}

export function useTenantManagement() {
  const { user } = useProductionAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserTenants = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Try to fetch from the tenants table if it exists
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .eq('is_active', true);

      if (!tenantsError && tenantsData && tenantsData.length > 0) {
        // If tenants table exists and has data, use it
        setUserTenants(tenantsData);
        
        if (tenantsData.length > 0 && !currentTenant) {
          setCurrentTenant(tenantsData[0]);
        }
      } else {
        // Fall back to mock data if table doesn't exist or is empty
        const mockTenants: Tenant[] = [
          {
            id: '1',
            name: 'Default Organization',
            slug: 'default-org',
            domain: undefined,
            settings: {},
            plan_type: 'standard',
            max_users: 100,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setUserTenants(mockTenants);
        
        if (mockTenants.length > 0 && !currentTenant) {
          setCurrentTenant(mockTenants[0]);
        }
      }
    } catch (error) {
      console.warn('Tenants table not available, using mock data:', error);
      
      // Use mock data as fallback
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Default Organization',
          slug: 'default-org',
          domain: undefined,
          settings: {},
          plan_type: 'standard',
          max_users: 100,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setUserTenants(mockTenants);
      
      if (mockTenants.length > 0 && !currentTenant) {
        setCurrentTenant(mockTenants[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    const tenant = userTenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem('current_tenant_id', tenantId);
    }
  };

  const createTenant = async (tenantData: {
    name: string;
    slug: string;
    domain?: string;
    plan_type?: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Try to insert into the tenants table if it exists
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          name: tenantData.name,
          slug: tenantData.slug,
          domain: tenantData.domain,
          plan_type: tenantData.plan_type || 'standard',
          max_users: 100,
          is_active: true
        })
        .select()
        .single();

      if (!error && data) {
        setUserTenants(prev => [...prev, data]);
        return { data, error: null };
      }
    } catch (error) {
      console.warn('Tenants table not available, using mock creation:', error);
    }

    // Fallback to mock creation
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: tenantData.name,
      slug: tenantData.slug,
      domain: tenantData.domain,
      settings: {},
      plan_type: tenantData.plan_type || 'standard',
      max_users: 100,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUserTenants(prev => [...prev, newTenant]);
    
    return { data: newTenant, error: null };
  };

  const getUserRole = async (tenantId?: string) => {
    if (!user) return null;
    
    try {
      // Try to fetch from tenant_users table if it exists
      const { data, error } = await supabase
        .from('tenant_users')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId || currentTenant?.id)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        return data.role;
      }
    } catch (error) {
      console.warn('Tenant users table not available, using mock role:', error);
    }
    
    // Return mock role as fallback
    return 'owner';
  };

  const hasPermission = async (requiredRole: string, tenantId?: string) => {
    const userRole = await getUserRole(tenantId);
    if (!userRole) return false;

    const roleHierarchy = ['member', 'admin', 'owner'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
  };

  useEffect(() => {
    if (user) {
      fetchUserTenants();
      
      // Restore last selected tenant
      const savedTenantId = localStorage.getItem('current_tenant_id');
      if (savedTenantId) {
        // Will be set when tenants are loaded
      }
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return {
    currentTenant,
    userTenants,
    isLoading,
    switchTenant,
    createTenant,
    getUserRole,
    hasPermission,
    refreshTenants: fetchUserTenants
  };
}
