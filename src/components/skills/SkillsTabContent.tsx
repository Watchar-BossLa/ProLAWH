
import { GreenSkillsFilter } from './GreenSkillsFilter';
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
    <div className="space-y-8">
      {/* Stats Overview */}
      <GreenSkillStats skills={skills} />
      
      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar - Filters and Analysis */}
        <div className="lg:col-span-1 space-y-6">
          <GreenSkillsFilter 
            categories={categories} 
            onFilterChange={onFilterChange}
          />
          <SkillGapAnalysis skillGapData={skillGapData} />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <GreenSkillCategories skills={skills} />
          <GreenSkillsList skills={skills} />
        </div>
      </div>
    </div>
  );
}
