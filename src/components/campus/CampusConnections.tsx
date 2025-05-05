
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CampusConnection } from "@/types/campus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, School, Settings, PlusCircle, RefreshCw, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CampusConnectionsProps {
  connections: CampusConnection[] | null;
  isLoading: boolean;
}

export function CampusConnections({ connections, isLoading }: CampusConnectionsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConnections = connections?.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.lmsType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddConnectionDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredConnections && filteredConnections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map((connection) => (
            <ConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>
      ) : connections && connections.length > 0 ? (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No matching connections</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search term or add a new campus connection.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Campus Connections</CardTitle>
            <CardDescription>
              Connect your first university to get started with the Campus Connector
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <School className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Universities can integrate with ProLawh through our LTI connector
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <AddConnectionDialog />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

interface ConnectionCardProps {
  connection: CampusConnection;
}

function ConnectionCard({ connection }: ConnectionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{connection.name}</CardTitle>
          <StatusBadge status={connection.status} />
        </div>
        <CardDescription>{connection.domain}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">LMS Type</span>
          <span className="text-sm font-medium">{connection.lmsType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Students</span>
          <span className="text-sm font-medium">{connection.studentCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Sync</span>
          <span className="text-sm font-medium">{formatLastSync(connection.lastSync)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manually trigger synchronization with this institution</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure connection settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Campus Connection</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove the connection to {connection.name}? This will stop synchronizing enrollments and credentials.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Remove Connection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "outline" | "secondary" | "destructive" = "default";
  
  switch (status) {
    case "active":
      variant = "default";
      break;
    case "pending":
      variant = "secondary";
      break;
    case "error":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

function formatLastSync(date: string) {
  const lastSync = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return lastSync.toLocaleDateString();
  }
}

function AddConnectionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Campus Connection</DialogTitle>
          <DialogDescription>
            Connect a new university to the ProLawh Campus Connector
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="institution-name">Institution Name</Label>
            <Input id="institution-name" placeholder="e.g., Harvard University" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" placeholder="e.g., harvard.edu" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lms-type">LMS Type</Label>
            <select id="lms-type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Select LMS Type</option>
              <option value="canvas">Canvas</option>
              <option value="moodle">Moodle</option>
              <option value="blackboard">Blackboard</option>
              <option value="d2l">Desire2Learn</option>
              <option value="sakai">Sakai</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-key">LTI Consumer Key</Label>
            <Input id="api-key" type="password" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-secret">LTI Shared Secret</Label>
            <Input id="api-secret" type="password" />
          </div>
        </div>
        
        <Alert>
          <School className="h-4 w-4" />
          <AlertTitle>LTI Setup Instructions</AlertTitle>
          <AlertDescription>
            After saving, you'll receive a URL and credentials to configure in your institution's LMS.
          </AlertDescription>
        </Alert>
        
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Add Connection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
