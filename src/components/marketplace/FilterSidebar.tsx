
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Shield, Leaf } from "lucide-react";
import type { FilterState } from "@/types/marketplace";

interface FilterSidebarProps {
  filter: FilterState;
  onFilterChange: (key: string, value: any) => void;
  commonSkills: string[];
}

export function FilterSidebar({ filter, onFilterChange, commonSkills }: FilterSidebarProps) {
  return (
    <Card className="lg:col-span-1 glass-card hover-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search opportunities..." 
              className="pl-8" 
              value={filter.query}
              onChange={(e) => onFilterChange('query', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="remote">Remote Only</Label>
            <Switch 
              id="remote" 
              checked={filter.remote}
              onCheckedChange={(checked) => onFilterChange('remote', checked)} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="insured" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Insured Gigs
            </Label>
            <Switch 
              id="insured"
              checked={filter.insured}
              onCheckedChange={(checked) => onFilterChange('insured', checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-green-500" />
              Green Score (Min {filter.minGreenScore})
            </Label>
          </div>
          <Slider 
            defaultValue={[0]} 
            max={100} 
            step={10}
            value={[filter.minGreenScore]}
            onValueChange={(value) => onFilterChange('minGreenScore', value[0])}
            className="my-2"
          />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map(skill => (
              <Badge 
                key={skill} 
                variant={filter.skillFilter.includes(skill) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (filter.skillFilter.includes(skill)) {
                    onFilterChange('skillFilter', filter.skillFilter.filter(s => s !== skill));
                  } else {
                    onFilterChange('skillFilter', [...filter.skillFilter, skill]);
                  }
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
