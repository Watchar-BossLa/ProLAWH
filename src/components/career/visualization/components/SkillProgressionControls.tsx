
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ViewType } from "../types/skillProgressionTypes";
import { PRESET_SKILLS } from "../utils/chartConfig";

interface SkillProgressionControlsProps {
  viewType: ViewType;
  setViewType: (value: ViewType) => void;
  selectedSkill: string;
  setSelectedSkill: (skill: string) => void;
}

export function SkillProgressionControls({
  viewType,
  setViewType,
  selectedSkill,
  setSelectedSkill
}: SkillProgressionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <ToggleGroup 
        type="single" 
        value={viewType} 
        onValueChange={(val) => val && setViewType(val as ViewType)}
      >
        <ToggleGroupItem value="overview" size="sm">Overall</ToggleGroupItem>
        <ToggleGroupItem value="specific" size="sm">By Skill</ToggleGroupItem>
      </ToggleGroup>
      
      {viewType === 'specific' && (
        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select skill" />
          </SelectTrigger>
          <SelectContent>
            {PRESET_SKILLS.map(skill => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
