
import { useState, useEffect } from 'react';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
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
  const { user } = useEnterpriseAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserTenants = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Use mock data since tables don't exist yet
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
        },
        {
          id: '2',
          name: 'ProLawh Enterprise',
          slug: 'prolawh-enterprise',
          domain: 'enterprise.prolawh.com',
          settings: { advanced_security: true },
          plan_type: 'enterprise',
          max_users: 500,
          is_active: true,
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setUserTenants(mockTenants);
      
      if (mockTenants.length > 0 && !currentTenant) {
        // Check for saved tenant or use first one
        const savedTenantId = localStorage.getItem('current_tenant_id');
        const selectedTenant = savedTenantId 
          ? mockTenants.find(t => t.id === savedTenantId) || mockTenants[0]
          : mockTenants[0];
        setCurrentTenant(selectedTenant);
      }
    } catch (error) {
      console.warn('Using mock tenant data:', error);
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
      // Simulate tenant creation with mock data
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
    } catch (error) {
      console.warn('Tenant creation simulation:', error);
      return { data: null, error: 'Failed to create tenant' };
    }
  };

  const getUserRole = async (tenantId?: string) => {
    if (!user) return null;
    
    // Return mock role since tables don't exist yet
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
