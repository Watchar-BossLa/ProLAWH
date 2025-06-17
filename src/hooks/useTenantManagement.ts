
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProductionAuth } from '@/components/auth/ProductionAuthProvider';
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

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase
          .from('tenant_users')
          .select(`
            tenant_id,
            role,
            tenants:tenant_id (
              id,
              name,
              slug,
              domain,
              settings,
              plan_type,
              max_users,
              is_active,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) throw error;
        return data;
      },
      { operation: 'fetch_user_tenants' }
    );

    if (data) {
      const tenants = data.map((item: any) => item.tenants).filter(Boolean);
      setUserTenants(tenants);
      
      // Set first tenant as current if none selected
      if (tenants.length > 0 && !currentTenant) {
        setCurrentTenant(tenants[0]);
      }
    }
  };

  const switchTenant = async (tenantId: string) => {
    const tenant = userTenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      // Store in localStorage for persistence
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

    const { data, error } = await handleAsyncError(
      async () => {
        // Create tenant
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .insert({
            name: tenantData.name,
            slug: tenantData.slug,
            domain: tenantData.domain,
            plan_type: tenantData.plan_type || 'standard'
          })
          .select()
          .single();

        if (tenantError) throw tenantError;

        // Add user as owner
        const { error: userError } = await supabase
          .from('tenant_users')
          .insert({
            tenant_id: tenant.id,
            user_id: user.id,
            role: 'owner'
          });

        if (userError) throw userError;

        return tenant;
      },
      { operation: 'create_tenant' }
    );

    if (data) {
      await fetchUserTenants();
    }

    return { data, error };
  };

  const getUserRole = async (tenantId?: string) => {
    if (!user) return null;
    
    const targetTenantId = tenantId || currentTenant?.id;
    if (!targetTenantId) return null;

    const { data } = await supabase
      .from('tenant_users')
      .select('role')
      .eq('tenant_id', targetTenantId)
      .eq('user_id', user.id)
      .single();

    return data?.role || null;
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
      fetchUserTenants().finally(() => setIsLoading(false));
      
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
