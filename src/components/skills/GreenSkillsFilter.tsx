
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search green skills..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer">
          All Skills
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          High Impact
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Growing Demand
        </Badge>
        <Badge variant="outline" className="cursor-pointer bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          Sustainable
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Category</label>
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
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">Impact Level</label>
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
      </div>
    </div>
  );
}
