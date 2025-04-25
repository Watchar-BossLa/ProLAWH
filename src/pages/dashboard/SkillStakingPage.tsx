
import { SkillStakesList } from "@/components/skills/SkillStakesList";
import { Coins } from "lucide-react";
import { pageTransitions } from "@/lib/transitions";

export default function SkillStakingPage() {
  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <Coins className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Skill Staking</h1>
          <p className="text-muted-foreground">Stake tokens on your skills and earn rewards</p>
        </div>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
        <p>
          Stake your tokens on skills you're confident in or learning. Earn rewards as you
          complete challenges and verify your expertise.
        </p>
      </div>

      <SkillStakesList />
    </div>
  );
}
