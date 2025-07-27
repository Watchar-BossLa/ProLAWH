
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, Network, Activity, BarChart } from 'lucide-react';

export function QuorumForgeDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    agentCount: 0,
    tasksCompleted: 0,
    activePlans: 0,
    securityScore: 85,
    swarmMetrics: {
      totalTasks: 0,
      avgConcurrency: 0,
      completionRate: 0
    }
  });
  
  // Simulated metrics - in production this would fetch from Prometheus
  useEffect(() => {
    const simulateMetrics = () => {
      setMetrics({
        agentCount: Math.floor(Math.random() * 5) + 8,
        tasksCompleted: metrics.tasksCompleted + Math.floor(Math.random() * 3),
        activePlans: Math.floor(Math.random() * 3) + 1,
        securityScore: Math.min(100, metrics.securityScore + (Math.random() > 0.7 ? 1 : -1)),
        swarmMetrics: {
          totalTasks: metrics.swarmMetrics.totalTasks + Math.floor(Math.random() * 5),
          avgConcurrency: 3.5 + (Math.random() * 1.5),
          completionRate: 0.85 + (Math.random() * 0.1)
        }
      });
    };
    
    const interval = setInterval(simulateMetrics, 5000);
    return () => clearInterval(interval);
  }, [metrics]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">QuorumForge OS</h2>
        <Badge variant="outline" className="ml-2">
          {metrics.securityScore >= 90 ? 'Secure' : 'Active'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Brain className="h-4 w-4 mr-2" />
              Agent Councils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.agentCount}</div>
            <p className="text-xs text-muted-foreground">Active AI agents</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Activity className="h-4 w-4 mr-2" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">Processed by Swarm</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Shield className="h-4 w-4 mr-2" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.securityScore}/100</div>
            <p className="text-xs text-muted-foreground">OPA policy compliance</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Mesh</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Real-time status of QuorumForge OS components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Agent Network</span>
                  <Badge variant="outline" className="bg-green-500/20">Operational</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Policies</span>
                  <Badge variant="outline" className="bg-green-500/20">Enforced</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">A2A Messaging</span>
                  <Badge variant="outline" className="bg-green-500/20">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Swarm Execution</span>
                  <Badge variant="outline" className="bg-green-500/20">Running</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Network</CardTitle>
              <CardDescription>
                Communication mesh between AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Network className="h-32 w-32 text-muted-foreground/40" />
              <span className="ml-4 text-muted-foreground">
                Agent Network Visualization
              </span>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls</CardTitle>
              <CardDescription>
                Policy enforcement and security measures
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Shield className="h-32 w-32 text-muted-foreground/40" />
              <span className="ml-4 text-muted-foreground">
                Security Controls Dashboard
              </span>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>
                Performance and operational metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <BarChart className="h-32 w-32 text-muted-foreground/40" />
              <span className="ml-4 text-muted-foreground">
                Metrics Dashboard
              </span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
