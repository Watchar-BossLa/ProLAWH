
import { useSkillBadges } from "@/hooks/useSkillBadges";
import { MockData } from "@/types/mocks";

export default function SkillsAndBadgesPage() {
  const { badges, loading } = useSkillBadges();
  
  if (loading) {
    return <div>Loading badges...</div>;
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Skills & Badges</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges?.map((badge: MockData) => (
          <div key={badge.id || badge.badge_id || `badge-${Math.random()}`} className="border rounded-lg p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-3">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="font-bold text-lg">{badge.name || "Badge"}</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">{badge.description || "Achievement unlocked!"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
