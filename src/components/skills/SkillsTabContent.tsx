
import { GreenSkillsFilter } from './GreenSkillsFilter';
import { SkillVerification } from './SkillVerification';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { GreenSkillStats } from './GreenSkillStats';
import { GreenSkillCategories } from './GreenSkillCategories';
import { GreenSkillsList } from './GreenSkillsList';
import { VerifiedSkillBadges } from './verification/VerifiedSkillBadges';

interface Skill {
  id: string;
  name: string;
  description?: string;
  category: string;
  level: number;
  isGreen: boolean;
  impactLevel?: string;
  co2_reduction?: number;
  [key: string]: any; // For any other properties that might exist
}

interface SkillGapData {
  skill: string;
  gap: number;
  priority: string;
  [key: string]: any; // For other properties
}

interface SkillsTabContentProps {
  skills: Skill[];
  categories: string[];
  skillGapData: SkillGapData[];
  onFilterChange: (filter: { search: string; category: string; impactLevel: string }) => void;
}

export function SkillsTabContent({ 
  skills, 
  categories, 
  skillGapData, 
  onFilterChange 
}: SkillsTabContentProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <GreenSkillsFilter 
            categories={categories} 
            onFilterChange={onFilterChange}
          />
          <SkillVerification />
          <SkillGapAnalysis skillGapData={skillGapData} />
        </div>
        <div className="md:col-span-2 space-y-6">
          <VerifiedSkillBadges />
          <GreenSkillStats skills={skills} />
          <GreenSkillCategories skills={skills} />
          <GreenSkillsList skills={skills} />
        </div>
      </div>
    </div>
  );
}
