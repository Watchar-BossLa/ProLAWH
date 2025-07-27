
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
import { useRoles, UserRole } from '@/hooks/useRoles';
import { Loading } from '@/components/ui/loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { ENV } from '@/config';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  requireAuth = true,
  fallback 
}: AuthGuardProps) {
  const { user, isLoading: authLoading } = useEnterpriseAuth();
  const { hasAnyRole, loading: rolesLoading, error: rolesError } = useRoles();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading || (user && rolesLoading)) {
    return <Loading message="Checking permissions..." />;
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    const redirectPath = ENV.isProduction ? "/auth" : "/auth";
    return <Navigate to={redirectPath} state={{ returnUrl: location.pathname }} replace />;
  }

  // Check if specific roles are required
  if (requiredRoles.length > 0 && user) {
    // If there's an error loading roles, show the error
    if (rolesError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Error loading user permissions: {rolesError}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Check if user has required roles
    if (!hasAnyRole(requiredRoles)) {
      if (fallback) {
        return <>{fallback}</>;
      }
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You don't have the required permissions to access this page. 
              Required roles: {requiredRoles.join(', ')}
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredRoles={['admin']}>{children}</AuthGuard>
);

export const MentorGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredRoles={['mentor', 'admin']}>{children}</AuthGuard>
);

export const EmployerGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredRoles={['employer', 'admin']}>{children}</AuthGuard>
);
