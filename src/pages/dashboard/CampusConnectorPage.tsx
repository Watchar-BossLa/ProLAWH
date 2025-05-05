
import { useState } from "react";
import { CampusConnectorOverview } from "@/components/campus/CampusConnectorOverview";
import { CampusConnections } from "@/components/campus/CampusConnections";
import { CampusLTISetup } from "@/components/campus/CampusLTISetup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, School, Settings } from "lucide-react";
import { pageTransitions } from "@/lib/transitions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useCampusConnector } from "@/hooks/useCampusConnector";

export default function CampusConnectorPage() {
  const { user } = useAuth();
  const { connections, stats, isLoading, error } = useCampusConnector();
  const [activeTab, setActiveTab] = useState("overview");

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Campus Connector</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Campus Connector</h1>
          <p className="text-muted-foreground">Seamlessly integrate with educational institutions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Active Connections</span>
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>LTI Setup</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-in fade-in-50 duration-500">
          <CampusConnectorOverview stats={stats} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="connections" className="animate-in fade-in-50 duration-500">
          <CampusConnections connections={connections} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="setup" className="animate-in fade-in-50 duration-500">
          <CampusLTISetup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
