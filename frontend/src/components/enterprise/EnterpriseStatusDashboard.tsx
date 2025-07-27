import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Server,
  Database,
  Lock,
  Zap,
  BarChart3,
  Download
} from "lucide-react";
import { enterpriseHealthMonitor, SystemHealthReport } from '@/utils/health';
import { enterpriseSecurity } from '@/utils/security';
import { enterpriseLogger } from '@/utils/logging';

export function EnterpriseStatusDashboard() {
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load health data
      const health = await enterpriseHealthMonitor.performHealthCheck();
      setHealthReport(health);
      
      // Load security metrics
      const security = enterpriseSecurity.getSecurityMetrics();
      setSecurityMetrics(security);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unhealthy': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatUptime = (uptimeMs: number) => {
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const exportHealthData = () => {
    const data = enterpriseHealthMonitor.exportHealthData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prolawh-health-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading && !healthReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Enterprise Status Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enterprise Status Dashboard</h2>
          <p className="text-muted-foreground">
            System health, security metrics, and operational status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={exportHealthData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={loadDashboardData} disabled={isLoading}>
            <Activity className="h-4 w-4 mr-2" />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>
            Last updated: {lastUpdated.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              {healthReport && getStatusIcon(healthReport.overall)}
              <div>
                <p className="font-medium">Overall Status</p>
                <p className={`text-sm ${healthReport ? getStatusColor(healthReport.overall) : 'text-gray-600'}`}>
                  {healthReport?.overall || 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Uptime</p>
                <p className="text-sm text-blue-600">
                  {healthReport ? formatUptime(healthReport.uptime) : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-purple-600" />
              <div>
                <p className="font-medium">Security Events</p>
                <p className="text-sm text-purple-600">
                  {securityMetrics?.totalEvents || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">Version</p>
                <p className="text-sm text-green-600">
                  {healthReport?.version || '1.0.0'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health">
            <Activity className="h-4 w-4 mr-2" />
            Health Checks
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Status</CardTitle>
              <CardDescription>
                Real-time status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthReport?.checks.map((check) => (
                  <div key={check.service} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <p className="font-medium capitalize">{check.service}</p>
                        <p className="text-sm text-muted-foreground">
                          Response time: {check.responseTime.toFixed(2)}ms
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={check.status === 'healthy' ? 'default' : 
                                   check.status === 'degraded' ? 'secondary' : 'destructive'}>
                        {check.status}
                      </Badge>
                      {check.error && (
                        <p className="text-xs text-red-600 mt-1">{check.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Security Events</span>
                    <Badge variant="outline">{securityMetrics?.totalEvents || 0}</Badge>
                  </div>
                  
                  {securityMetrics?.eventsBySeverity && Object.entries(securityMetrics.eventsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <span className="capitalize">{severity} Events</span>
                      <Badge variant={severity === 'critical' ? 'destructive' : 
                                   severity === 'high' ? 'destructive' :
                                   severity === 'medium' ? 'secondary' : 'outline'}>
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityMetrics?.eventsByType && Object.entries(securityMetrics.eventsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      <span className="text-sm font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {securityMetrics?.recentEvents && securityMetrics.recentEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityMetrics.recentEvents.slice(0, 5).map((event: any, index: number) => (
                    <Alert key={index} variant={event.severity === 'critical' || event.severity === 'high' ? 'destructive' : 'default'}>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <span className="font-medium">{event.type}:</span> {event.description}
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(event.context.timestamp).toLocaleString()}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>Average response times by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthReport?.checks.map((check) => (
                    <div key={check.service} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm capitalize">{check.service}</span>
                        <span className="text-sm font-medium">{check.responseTime.toFixed(2)}ms</span>
                      </div>
                      <Progress 
                        value={Math.min((check.responseTime / 2000) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>Current system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Memory Usage</span>
                    <Badge variant="outline">
                      {healthReport?.checks.find(c => c.service === 'client')?.metadata?.memoryUsage ? 
                        `${Math.round((healthReport.checks.find(c => c.service === 'client')!.metadata!.memoryUsage.used / 1024 / 1024))}MB` : 
                        'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Connection Type</span>
                    <Badge variant="outline">
                      {healthReport?.checks.find(c => c.service === 'client')?.metadata?.connectionType || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Online Status</span>
                    <Badge variant={healthReport?.checks.find(c => c.service === 'client')?.metadata?.online ? 'default' : 'destructive'}>
                      {healthReport?.checks.find(c => c.service === 'client')?.metadata?.online ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
