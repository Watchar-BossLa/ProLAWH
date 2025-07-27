
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GreenSkillsFilterProps {
  categories: string[];
  onFilterChange: (filter: {
    search: string;
    category: string;
    impactLevel: string;
  }) => void;
}

export function GreenSkillsFilter({
  categories,
  onFilterChange,
}: GreenSkillsFilterProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [impactLevel, setImpactLevel] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, category, impactLevel });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, category: value, impactLevel });
  };

  const handleImpactChange = (value: string) => {
    setImpactLevel(value);
    onFilterChange({ search, category, impactLevel: value });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search Skills</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search green skills..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              All Skills
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              High Impact
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Growing Demand
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-green-500 hover:text-white transition-colors bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
            >
              Sustainable
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Impact Level Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Impact Level</label>
          <Select value={impactLevel} onValueChange={handleImpactChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Impact</SelectItem>
              <SelectItem value="medium">Medium Impact</SelectItem>
              <SelectItem value="low">Low Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
