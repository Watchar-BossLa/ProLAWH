
import { useEffect } from "react";
import { SkillStakingDashboard } from "@/components/skills/SkillStakingDashboard";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { pageTransitions } from "@/lib/transitions";

/**
 * SkillStakingPage - Main page component for skill staking functionality
 * 
 * This page integrates the skill staking dashboard and tracks user activity.
 * It implements ProLawh's technical blueprint section 3.2 for Skill-Staking & Revenue-Share Pools.
 */
export default function SkillStakingPage() {
  const { trackActivity } = useActivityTracker();
  
  useEffect(() => {
    // Track user activity when page is loaded
    trackActivity("page_view", { path: "/dashboard/skill-staking" });
    trackActivity("skill_staking_page_viewed");
  }, [trackActivity]);
  
  return (
    <div className={`container max-w-7xl mx-auto py-6 ${pageTransitions.initial}`}>
      <SkillStakingDashboard />
    </div>
  );
}

// Just for backwards compatibility in case someone still imports it with named import
export { SkillStakingPage };
