
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Shield, 
  Network,
  Coins,
  BookOpen,
  BarChart3
} from "lucide-react";
import { WalletSetup } from "./wallet/WalletSetup";
import { CredentialsList } from "./wallet/CredentialsList";

export function VeriSkillOverview() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Network className="h-5 w-5 text-primary" />
          <span className="font-medium">VeriSkill Network</span>
          <Badge variant="secondary">Alpha</Badge>
        </div>
        
        <h1 className="text-3xl font-bold">Decentralized Skill Passport</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your skills, verified and portable across the digital economy. 
          Issue, store, and share W3C verifiable credentials with complete self-sovereignty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 border rounded-lg">
          <Wallet className="h-8 w-8 mx-auto mb-3 text-blue-500" />
          <h3 className="font-semibold mb-2">Digital Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Self-sovereign identity with Ed25519 cryptography and recovery options
          </p>
        </div>
        
        <div className="text-center p-6 border rounded-lg">
          <Shield className="h-8 w-8 mx-auto mb-3 text-green-500" />
          <h3 className="font-semibold mb-2">Verifiable Credentials</h3>
          <p className="text-sm text-muted-foreground">
            W3C-compliant certificates anchored on Polygon blockchain
          </p>
        </div>
        
        <div className="text-center p-6 border rounded-lg">
          <Coins className="h-8 w-8 mx-auto mb-3 text-purple-500" />
          <h3 className="font-semibold mb-2">Gig Marketplace</h3>
          <p className="text-sm text-muted-foreground">
            Stablecoin escrow with skill-based matching and yield sharing
          </p>
        </div>
      </div>

      <Tabs defaultValue="wallet" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          <WalletSetup />
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <CredentialsList />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="text-center py-12">
            <Coins className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Gig Marketplace</h3>
            <p className="text-muted-foreground">
              Coming soon: Decentralized freelance marketplace with stablecoin payments
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Skill Analytics</h3>
            <p className="text-muted-foreground">
              Coming soon: Market demand insights and skill value tracking
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
