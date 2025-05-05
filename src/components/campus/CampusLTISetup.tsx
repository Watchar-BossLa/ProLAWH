
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Download, FileCode, Terminal } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CampusLTISetup() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("docker");
  
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${description} has been copied to your clipboard.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LTI Integration Setup</CardTitle>
          <CardDescription>
            Connect your university's Learning Management System with ProLawh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">LTI Launch URL</h3>
              <div className="flex">
                <code className="flex-1 p-2 bg-muted rounded-l-md text-xs overflow-x-auto whitespace-nowrap">
                  https://prolawh.edu/lti/launch
                </code>
                <Button
                  variant="secondary" 
                  size="sm" 
                  className="rounded-l-none"
                  onClick={() => copyToClipboard("https://prolawh.edu/lti/launch", "LTI Launch URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">LTI Client ID</h3>
              <div className="flex">
                <code className="flex-1 p-2 bg-muted rounded-l-md text-xs overflow-x-auto whitespace-nowrap">
                  prolawh_campus_connector
                </code>
                <Button
                  variant="secondary" 
                  size="sm" 
                  className="rounded-l-none"
                  onClick={() => copyToClipboard("prolawh_campus_connector", "LTI Client ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableCaption>Required parameters for LTI 1.3 integration</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>LTI Version</TableCell>
                <TableCell>LTI 1.3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Public JWK URL</TableCell>
                <TableCell className="font-mono text-xs">https://prolawh.edu/lti/keys</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Redirect URLs</TableCell>
                <TableCell className="font-mono text-xs">https://prolawh.edu/lti/callback</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Custom Fields</TableCell>
                <TableCell className="font-mono text-xs">context_id=$Context.id$,resource_link_id=$ResourceLink.id$</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installation Instructions</CardTitle>
          <CardDescription>
            Choose your preferred deployment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
              <TabsTrigger value="helm">Helm Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="docker" className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-md text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Docker Installation</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-white hover:text-white hover:bg-white/10"
                    onClick={() => copyToClipboard(dockerCommand, "Docker command")}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {dockerCommand}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Run this Docker command to start the Campus Connector on your server. It will automatically connect to your ProLawh instance.
              </p>
            </TabsContent>
            <TabsContent value="kubernetes" className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-md text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Kubernetes Manifest</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 text-white hover:text-white hover:bg-white/10"
                      onClick={() => copyToClipboard(kubernetesManifest, "Kubernetes manifest")}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 text-white hover:text-white hover:bg-white/10"
                    >
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                  </div>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {kubernetesManifest}
                </pre>
              </div>
              <div className="bg-zinc-950 p-4 rounded-md text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Apply Command</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-white hover:text-white hover:bg-white/10"
                    onClick={() => copyToClipboard("kubectl apply -f campus-connector.yaml -n education", "Kubectl apply command")}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto">
                  kubectl apply -f campus-connector.yaml -n education
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="helm" className="space-y-4">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">One-line Helm installation</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-md text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Helm Command</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-white hover:text-white hover:bg-white/10"
                    onClick={() => copyToClipboard("helm install prolawh-campus-connector prolawh/campus-connector -n education", "Helm command")}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre">
                  helm install prolawh-campus-connector prolawh/campus-connector -n education
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                This will install the Campus Connector Helm chart in the education namespace. The chart includes all necessary components for LTI integration.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <FileCode className="h-3 w-3" />
                  values.yaml
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Terminal className="h-3 w-3" />
                  Documentation
                </Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Setup Guide
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const dockerCommand = `docker run -d \\
  --name prolawh-campus-connector \\
  -p 8080:8080 \\
  -e PROLAWH_API_URL=https://api.prolawh.edu \\
  -e PROLAWH_API_KEY=your_api_key_here \\
  -e LTI_CONSUMER_KEY=your_consumer_key \\
  -e LTI_SHARED_SECRET=your_shared_secret \\
  prolawh/campus-connector:latest`;

const kubernetesManifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: prolawh-campus-connector
  namespace: education
spec:
  replicas: 2
  selector:
    matchLabels:
      app: campus-connector
  template:
    metadata:
      labels:
        app: campus-connector
    spec:
      containers:
      - name: campus-connector
        image: prolawh/campus-connector:latest
        ports:
        - containerPort: 8080
        env:
        - name: PROLAWH_API_URL
          value: "https://api.prolawh.edu"
        - name: PROLAWH_API_KEY
          valueFrom:
            secretKeyRef:
              name: prolawh-secrets
              key: api-key
        - name: LTI_CONSUMER_KEY
          valueFrom:
            secretKeyRef:
              name: lti-credentials
              key: consumer-key
        - name: LTI_SHARED_SECRET
          valueFrom:
            secretKeyRef:
              name: lti-credentials
              key: shared-secret
---
apiVersion: v1
kind: Service
metadata:
  name: campus-connector
  namespace: education
spec:
  selector:
    app: campus-connector
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP`;
