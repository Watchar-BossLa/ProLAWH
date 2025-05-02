
import React from 'react';
import { Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CareerTwinFiltersProps {
  typeFilter: string;
  statusFilter: string;
  setTypeFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
}

export const CareerTwinFilters: React.FC<CareerTwinFiltersProps> = ({
  typeFilter,
  statusFilter,
  setTypeFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold">Your Recommendations</h2>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Filters:</span>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Recommendation Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="skill_gap">Skill Gap</SelectItem>
              <SelectItem value="job_match">Job Match</SelectItem>
              <SelectItem value="mentor_suggest">Mentorship</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
