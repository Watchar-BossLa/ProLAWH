
import { SkillStakesList } from "@/components/skills/SkillStakesList";
import { StakeableSkillsList } from "@/components/skills/StakeableSkillsList";
import { Coins } from "lucide-react";
import { pageTransitions } from "@/lib/transitions";
import { ConnectWalletButton } from "@/components/skills/ConnectWalletButton";
import { usePolygonWallet } from "@/hooks/usePolygonWallet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SkillStakingPage() {
  const { isConnected } = usePolygonWallet();

  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Coins className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Skill Staking</h1>
            <p className="text-muted-foreground">Stake tokens on your skills and earn rewards</p>
          </div>
        </div>
        <ConnectWalletButton />
      </div>

      {!isConnected && (
        <Alert>
          <AlertTitle>Connect your wallet</AlertTitle>
          <AlertDescription>
            Connect your Polygon wallet to start staking on your skills and earning rewards.
          </AlertDescription>
        </Alert>
      )}

      <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
        <p>
          Stake your tokens on skills you're confident in or learning. Earn rewards as you
          complete challenges and verify your expertise.
        </p>
      </div>

      <Tabs defaultValue="my-stakes">
        <TabsList className="mb-4">
          <TabsTrigger value="my-stakes">My Stakes</TabsTrigger>
          <TabsTrigger value="stake-skills">Stake on Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="my-stakes">
          <SkillStakesList />
        </TabsContent>
        <TabsContent value="stake-skills">
          <StakeableSkillsList />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">About Skill Staking on Polygon</h2>
        <p className="mb-4">
          Skill staking lets you put your USDC tokens behind your skills, creating a financial incentive
          to improve and validate your expertise. All stakes are secured on the Polygon blockchain for
          transparency and security.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 p-4 bg-background rounded-md">
            <h3 className="font-semibold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Earn rewards on your verified skills</li>
              <li>Showcase skill confidence to employers</li>
              <li>Join skill-specific revenue pools</li>
              <li>Low gas fees through Polygon network</li>
            </ul>
          </div>
          <div className="flex-1 p-4 bg-background rounded-md">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect your Polygon wallet</li>
              <li>Choose a skill to stake on</li>
              <li>Set your stake amount in USDC</li>
              <li>Complete challenges to earn rewards</li>
              <li>Withdraw your stake anytime</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
