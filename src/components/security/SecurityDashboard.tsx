/**
 * Security Dashboard Component
 * Displays security metrics and recent events for administrators
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Activity, Users } from 'lucide-react';
import { enterpriseSecurity } from '@/utils/security';

import { SecurityEvent } from '@/utils/security/types';

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Get security metrics
    const securityMetrics = enterpriseSecurity.getSecurityMetrics();
    setMetrics(securityMetrics);
    setRecentEvents(securityMetrics.recentEvents || []);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Activity className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading security metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security events and system health
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Enterprise Security Active
        </Badge>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Security events logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.eventsBySeverity?.critical || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.eventsBySeverity?.high || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              High severity events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Good</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security events and alerts from your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No recent security events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <Alert key={index} className="border-l-4" style={{
                      borderLeftColor: event.severity === 'critical' ? 'hsl(var(--destructive))' :
                                     event.severity === 'high' ? 'hsl(var(--destructive))' :
                                     event.severity === 'medium' ? 'hsl(var(--secondary))' : 
                                     'hsl(var(--muted))'
                    }}>
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(event.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getSeverityColor(event.severity) as any}>
                              {event.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {event.type.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(event.timestamp || event.context.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <AlertDescription>
                            {event.description}
                          </AlertDescription>
                          {event.metadata && (
                            <pre className="mt-2 text-xs bg-muted p-2 rounded">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Events by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.eventsBySeverity || {}).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(severity)}
                        <span className="capitalize">{severity}</span>
                      </div>
                      <Badge variant={getSeverityColor(severity) as any}>
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(metrics.eventsByType || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm capitalize">
                        {type.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Current security settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Input Sanitization</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sanitize all user inputs
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    Enabled
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Prevent abuse with request rate limiting
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    Enabled
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Security Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor for suspicious activities
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    Active
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log all security events and user actions
                    </p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}