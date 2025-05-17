
import { Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ArcadeFiltersProps {
  filterType: string;
  filterDifficulty: string;
  setFilterType: (value: string) => void;
  setFilterDifficulty: (value: string) => void;
}

export function ArcadeFilters({ 
  filterType, 
  filterDifficulty, 
  setFilterType, 
  setFilterDifficulty 
}: ArcadeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b pb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Filter className="h-5 w-5" /> 
        Challenge Filters
      </h2>
      <div className="flex gap-3">
        <Select
          value={filterType}
          onValueChange={setFilterType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Challenge Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="camera">Camera</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="ar">AR</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filterDifficulty}
          onValueChange={setFilterDifficulty}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
