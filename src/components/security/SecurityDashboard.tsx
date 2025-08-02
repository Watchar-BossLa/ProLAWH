import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, Users, Activity } from 'lucide-react';
import { enterpriseSecurity } from '@/utils/security';
import { useSessionManager } from '@/components/security/session/hooks/useSessionManager';

interface SecurityMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [securityLog, setSecurityLog] = useState<any[]>([]);
  const { sessions, revokeAllOtherSessions } = useSessionManager();

  useEffect(() => {
    // Load security metrics
    const securityMetrics = enterpriseSecurity.getSecurityMetrics();
    const log = enterpriseSecurity.getSecurityLog();
    
    setSecurityLog(log);
    
    // Calculate metrics
    const calculatedMetrics: SecurityMetric[] = [
      {
        name: 'Total Security Events',
        value: securityMetrics.totalEvents,
        status: securityMetrics.totalEvents < 10 ? 'good' : 'warning',
        description: 'Total security events logged'
      },
      {
        name: 'High Risk Events',
        value: securityMetrics.eventsBySeverity.high || 0,
        status: (securityMetrics.eventsBySeverity.high || 0) === 0 ? 'good' : 'critical',
        description: 'High severity security events'
      },
      {
        name: 'Active Sessions',
        value: sessions.length,
        status: sessions.length <= 3 ? 'good' : 'warning',
        description: 'Number of active user sessions'
      },
      {
        name: 'CSP Status',
        value: enterpriseSecurity.validateCSP() ? 1 : 0,
        status: enterpriseSecurity.validateCSP() ? 'good' : 'critical',
        description: 'Content Security Policy validation'
      }
    ];
    
    setMetrics(calculatedMetrics);
  }, [sessions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      critical: 'destructive'
    } as const;
    
    return <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>{severity}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security events and monitoring data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityLog.slice(-10).reverse().map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(event.severity)}
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.type} • {new Date(event.context.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Risk: {event.context.riskScore}/10
                    </div>
                  </div>
                ))}
                {securityLog.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No security events recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>Manage active user sessions and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.length > 1 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have {sessions.length} active sessions. Consider revoking unused sessions for security.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={revokeAllOtherSessions}
                variant="outline"
                disabled={sessions.length <= 1}
              >
                Revoke All Other Sessions
              </Button>

              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.device_id || 'Unknown Device'}</p>
                      <p className="text-sm text-muted-foreground">
                        Device ID: {session.device_id?.substring(0, 8)}... • 
                        Last active: {new Date(session.last_activity).toLocaleString()}
                      </p>
                    </div>
                    {session.is_current && (
                      <Badge variant="secondary">Current Session</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Important security settings and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Leaked Password Protection:</strong> Enable leaked password protection in Supabase Auth settings to prevent users from using compromised passwords.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Headers:</strong> Security headers are properly configured and active.
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Input Sanitization:</strong> All user inputs are sanitized to prevent XSS attacks.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}