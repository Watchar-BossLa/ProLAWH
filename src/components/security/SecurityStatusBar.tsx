import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { enterpriseSecurity } from '@/utils/security';
import { cn } from '@/lib/utils';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'critical';
  message: string;
  lastCheck: Date;
}

/**
 * SECURITY FIX: Security status indicator for users
 */
export function SecurityStatusBar() {
  const [status, setStatus] = useState<SecurityStatus>({
    level: 'secure',
    message: 'All systems secure',
    lastCheck: new Date()
  });

  useEffect(() => {
    const checkSecurityStatus = async () => {
      try {
        // Validate current security state
        const hasCSP = enterpriseSecurity.validateCSP();
        const hasSecureHeaders = true; // Would check for security headers
        
        let level: SecurityStatus['level'] = 'secure';
        let message = 'All systems secure';

        if (!hasCSP) {
          level = 'warning';
          message = 'Content Security Policy not fully configured';
        }

        // Check for recent security events
        const metrics = enterpriseSecurity.getSecurityMetrics();
        const recentCritical = metrics.recentEvents.filter(
          event => event.severity === 'critical' && 
          new Date(event.context.timestamp) > new Date(Date.now() - 300000) // 5 minutes
        );

        if (recentCritical.length > 0) {
          level = 'critical';
          message = `${recentCritical.length} critical security event(s) detected`;
        }

        setStatus({
          level,
          message,
          lastCheck: new Date()
        });

      } catch (error) {
        setStatus({
          level: 'warning',
          message: 'Unable to verify security status',
          lastCheck: new Date()
        });
      }
    };

    // Check immediately and then every 30 seconds
    checkSecurityStatus();
    const interval = setInterval(checkSecurityStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status.level) {
      case 'secure':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <Shield className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.level) {
      case 'secure':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-1 rounded-md border text-sm",
      getStatusColor()
    )}>
      {getStatusIcon()}
      <span className="font-medium">Security:</span>
      <span>{status.message}</span>
      <span className="text-xs opacity-70">
        Last check: {status.lastCheck.toLocaleTimeString()}
      </span>
    </div>
  );
}