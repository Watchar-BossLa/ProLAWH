
import { useState, useEffect } from 'react';
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

    // Mock data until database tables are created
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
    
    // Set first tenant as current if none selected
    if (mockTenants.length > 0 && !currentTenant) {
      setCurrentTenant(mockTenants[0]);
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

    // Mock API call
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
    
    // Mock role - return 'owner' for demo purposes
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
