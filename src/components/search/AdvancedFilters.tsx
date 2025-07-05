
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, RotateCcw, Save, Bookmark } from 'lucide-react';
import type { SearchOptions } from '@/services/searchService';

interface AdvancedFiltersProps {
  filters: Omit<SearchOptions, 'query'>;
  onFiltersChange: (filters: Partial<Omit<SearchOptions, 'query'>>) => void;
  availableSkills: string[];
  onReset: () => void;
  onSave?: (name: string) => void;
  savedFilters?: Array<{ name: string; filters: Omit<SearchOptions, 'query'> }>;
  onLoadSavedFilter?: (filters: Omit<SearchOptions, 'query'>) => void;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  availableSkills,
  onReset,
  onSave,
  savedFilters = [],
  onLoadSavedFilter
}: AdvancedFiltersProps) {
  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills || [];
    if (currentSkills.includes(skill)) {
      onFiltersChange({
        skills: currentSkills.filter(s => s !== skill)
      });
    } else {
      onFiltersChange({
        skills: [...currentSkills, skill]
      });
    }
  };

  const activeFiltersCount = [
    filters.remote,
    filters.insured,
    filters.minGreenScore && filters.minGreenScore > 0,
    filters.skills && filters.skills.length > 0,
    filters.sortBy && filters.sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave('My Filter')}
                className="h-8 w-8 p-0"
              >
                <Save className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Saved Filters</Label>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((savedFilter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadSavedFilter?.(savedFilter.filters)}
                  className="h-7 text-xs"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  {savedFilter.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select
            value={filters.sortBy || 'relevance'}
            onValueChange={(value) => onFiltersChange({ sortBy: value as SearchOptions['sortBy'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date Posted</SelectItem>
              <SelectItem value="greenScore">Green Score</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="remote-filter" className="text-sm font-medium">
              Remote Only
            </Label>
            <Switch
              id="remote-filter"
              checked={filters.remote || false}
              onCheckedChange={(checked) => onFiltersChange({ remote: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="insured-filter" className="text-sm font-medium">
              Insured Positions
            </Label>
            <Switch
              id="insured-filter"
              checked={filters.insured || false}
              onCheckedChange={(checked) => onFiltersChange({ insured: checked })}
            />
          </div>
        </div>

        {/* Green Score Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Minimum Green Score
            </Label>
            <span className="text-sm text-muted-foreground">
              {filters.minGreenScore || 0}%
            </span>
          </div>
          <Slider
            value={[filters.minGreenScore || 0]}
            onValueChange={(value) => onFiltersChange({ minGreenScore: value[0] })}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Skills Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Required Skills
            {filters.skills && filters.skills.length > 0 && (
              <span className="text-muted-foreground ml-1">
                ({filters.skills.length} selected)
              </span>
            )}
          </Label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {availableSkills.map(skill => (
              <Badge
                key={skill}
                variant={filters.skills?.includes(skill) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
                {filters.skills?.includes(skill) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
