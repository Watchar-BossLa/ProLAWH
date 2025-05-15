
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GreenSkillIndicator } from "./GreenSkillIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GreenSkillFilterProps {
  onFilterChange: (filters: {
    minScore: number;
    onlyGreen: boolean;
    enableHighlighting: boolean;
  }) => void;
}

export function GreenSkillFilter({ onFilterChange }: GreenSkillFilterProps) {
  const [minScore, setMinScore] = useState<number>(0);
  const [onlyGreen, setOnlyGreen] = useState<boolean>(false);
  const [enableHighlighting, setEnableHighlighting] = useState<boolean>(true);
  
  const handleScoreChange = (value: number[]) => {
    const newScore = value[0];
    setMinScore(newScore);
    onFilterChange({ minScore: newScore, onlyGreen, enableHighlighting });
  };
  
  const handleOnlyGreenChange = (checked: boolean) => {
    setOnlyGreen(checked);
    onFilterChange({ minScore, onlyGreen: checked, enableHighlighting });
  };
  
  const handleHighlightingChange = (checked: boolean) => {
    setEnableHighlighting(checked);
    onFilterChange({ minScore, onlyGreen, enableHighlighting: checked });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GreenSkillIndicator score={75} />
          Green-Skill Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="green-score">Minimum Green Impact</Label>
            <span className="text-sm font-medium">{minScore}/100</span>
          </div>
          
          <Slider
            id="green-score"
            min={0}
            max={100}
            step={5}
            defaultValue={[minScore]}
            onValueChange={handleScoreChange}
            aria-label="Green impact score filter"
          />
          
          <div className="flex items-start pt-4">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Switch
                  id="only-green"
                  checked={onlyGreen}
                  onCheckedChange={handleOnlyGreenChange}
                />
                <Label htmlFor="only-green">Show only green skills</Label>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Only display skills with positive environmental impact
              </p>
            </div>
          </div>
          
          <div className="flex items-start pt-4">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Switch
                  id="highlighting"
                  checked={enableHighlighting}
                  onCheckedChange={handleHighlightingChange}
                />
                <Label htmlFor="highlighting">Enable green highlighting</Label>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Visually highlight skills based on their green score
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
