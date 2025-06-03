
import React, { useEffect } from 'react';
import { PageWrapper } from "@/components/ui/page-wrapper";
import { EnterpriseStatusDashboard } from '@/components/enterprise';
import { enterpriseHealthMonitor } from '@/utils/enterpriseHealthCheck';
import { enterpriseSecurity } from '@/utils/security';
import { enterpriseLogger } from '@/utils/logging';

export default function EnterpriseMonitoringPage() {
  useEffect(() => {
    // Initialize enterprise monitoring systems
    enterpriseSecurity.initialize();
    enterpriseHealthMonitor.startMonitoring(300000); // 5-minute intervals
    
    enterpriseLogger.info('Enterprise monitoring page loaded', {}, 'EnterpriseMonitoringPage');

    return () => {
      enterpriseHealthMonitor.stopMonitoring();
    };
  }, []);

  return (
    <PageWrapper
      title="Enterprise Monitoring"
      description="Real-time system health, security monitoring, and operational metrics for enterprise-grade reliability and oversight."
    >
      <EnterpriseStatusDashboard />
    </PageWrapper>
  );
}
