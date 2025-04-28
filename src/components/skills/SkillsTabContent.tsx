
import { GreenSkillsFilter } from './GreenSkillsFilter';
import { SkillVerification } from './SkillVerification';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { GreenSkillStats } from './GreenSkillStats';
import { GreenSkillCategories } from './GreenSkillCategories';
import { GreenSkillsList } from './GreenSkillsList';

interface SkillsTabContentProps {
  skills: any[];
  categories: string[];
  skillGapData: any[];
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
        <div className="md:col-span-1">
          <GreenSkillsFilter 
            categories={categories} 
            onFilterChange={onFilterChange}
          />
          <div className="mt-6">
            <SkillVerification />
          </div>
          <div className="mt-6">
            <SkillGapAnalysis skillGapData={skillGapData} />
          </div>
        </div>
        <div className="md:col-span-2">
          <GreenSkillStats skills={skills} />
          <GreenSkillCategories skills={skills} />
          <GreenSkillsList skills={skills} />
        </div>
      </div>
    </div>
  );
}
