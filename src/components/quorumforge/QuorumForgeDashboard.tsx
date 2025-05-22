
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Code, Cpu, RefreshCw, Settings, Shield, Users } from 'lucide-react';

export const QuorumForgeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">QuorumForge OS</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 md:w-fit mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="councils">Councils</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SystemHealthCard />
            <AgentFabricCard />
            <SecuritySummaryCard />
          </div>
          <CouncilOverviewCard />
        </TabsContent>

        <TabsContent value="councils" className="space-y-6">
          <CouncilsList />
        </TabsContent>

        <TabsContent value="orchestration" className="space-y-6">
          <OrchestratorDashboard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <MetricsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SystemHealthCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">System Status</span>
            <Badge className="bg-green-500">Operational</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Agent Fabric</span>
            <Badge variant="outline">4/4 Councils Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Orchestrator</span>
            <Badge variant="secondary">Running</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Last Sync</span>
            <span className="text-xs text-muted-foreground">2 minutes ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AgentFabricCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          Agent Fabric
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Scan Council</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Fix Council</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Security Council</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Red-Team Council</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SecuritySummaryCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Secrets Hygiene</span>
            <Badge variant="secondary">Vault Healthy</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Policy Enforcer</span>
            <Badge variant="secondary">OPA Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Supply-Chain</span>
            <Badge className="bg-amber-500">1 Warning</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Zero-Trust</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">Compliant</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CouncilOverviewCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Council Activity</CardTitle>
        <CardDescription>Recent actions taken by QuorumForge councils</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Code className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Fix Council</span>
                  <Badge variant="outline" className="text-xs">Plan #F-{1000 + i}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fixed dependency vulnerability in authentication module
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>3{i} minutes ago</span>
                  <span>•</span>
                  <span>PR #{i + 120} merged</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CouncilsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agent Councils</CardTitle>
        <CardDescription>Autonomous GPT agents organized into domain-specific councils</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[
            { name: "Scan Council", description: "Analyzes code for vulnerabilities and improvement opportunities", agents: 3 },
            { name: "Fix Council", description: "Implements fixes and improvements based on Scan Council findings", agents: 4 },
            { name: "Security Council", description: "Focuses on security vulnerabilities and hardening", agents: 3 },
            { name: "Red-Team Council", description: "Performs adversarial testing of systems", agents: 2 }
          ].map((council, i) => (
            <div key={i} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <h3 className="font-medium">{council.name}</h3>
                <p className="text-sm text-muted-foreground">{council.description}</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{council.agents} autonomous agents</span>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const OrchestratorDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orchestration System</CardTitle>
        <CardDescription>Orchestrates council activities and implements approved plans</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Active Orchestrations</h3>
            <p className="text-sm text-muted-foreground mt-1">Currently running workflows and processes</p>
            
            <div className="mt-4 space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-secondary rounded-md">
                  <div>
                    <div className="font-medium">Plan #{i + 230} Implementation</div>
                    <div className="text-xs text-muted-foreground">Started 15 minutes ago</div>
                  </div>
                  <Badge>In Progress</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Pending Approval</h3>
            <p className="text-sm text-muted-foreground mt-1">Plans waiting for Senior Manager approval</p>
            
            <div className="mt-4">
              <div className="p-3 bg-secondary rounded-md">
                <div className="font-medium">Plan #233 - Security Update</div>
                <div className="text-xs text-muted-foreground">Submitted by Security Council</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-7">Approve</Button>
                  <Button size="sm" variant="outline" className="h-7">Reject</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SecurityDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Compliance Controls</CardTitle>
        <CardDescription>Zero-trust networking, secrets management, and policy enforcement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-medium">Secrets Management</h3>
            <div className="space-y-2">
              {[
                { name: "OPENAI_API_KEY", status: "secured" },
                { name: "GITHUB_TOKEN", status: "secured" }
              ].map((secret, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="font-mono text-sm">{secret.name}</div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">{secret.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-medium">Policy Enforcement (OPA)</h3>
            <div className="space-y-2">
              {[
                { name: "Max Token Budget", status: "enforced" },
                { name: "PR Approval Flow", status: "enforced" },
                { name: "CI Requirements", status: "enforced" }
              ].map((policy, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="text-sm">{policy.name}</div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">{policy.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-medium">Supply Chain Security</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">SBOM Generation</div>
                <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">SLSA Level 3</div>
                <Badge variant="outline" className="bg-green-100 text-green-800">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Dependency Audit</div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">1 Warning</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricsDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Performance and operational metrics for QuorumForge OS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">API Rate Limits</h3>
            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "65%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>65% used (1950/3000)</span>
              <span>Resets in 3h 24m</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Token Budget</h3>
            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "42%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>42% used ($21.35/$50.00)</span>
              <span>Daily budget</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Swarm Utilization</h3>
            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "28%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>28% utilized</span>
              <span>7 active swarm tasks</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-semibold">97.8%</div>
              <div className="text-sm text-muted-foreground">System uptime</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-semibold">134ms</div>
              <div className="text-sm text-muted-foreground">Avg response time</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-semibold">48</div>
              <div className="text-sm text-muted-foreground">PRs merged today</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-semibold">12</div>
              <div className="text-sm text-muted-foreground">Active chaos tests</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuorumForgeDashboard;
