
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { SearchFilters as SearchFiltersType } from "@/hooks/chat/types";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClose: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onClose }: SearchFiltersProps) {
  const handleDateRangeChange = (field: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;
    
    const currentRange = filters.dateRange || { start: new Date(), end: new Date() };
    onFiltersChange({
      dateRange: {
        ...currentRange,
        [field]: date
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      messageType: undefined,
      sender: undefined,
      dateRange: undefined,
      hasAttachments: undefined,
      hasReactions: undefined,
      hasReplies: undefined
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Search Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Message Type Filter */}
      <div className="space-y-2">
        <Label>Message Type</Label>
        <Select
          value={filters.messageType || ''}
          onValueChange={(value) => 
            onFiltersChange({ messageType: value as 'text' | 'file' | 'image' || undefined })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="text">Text messages</SelectItem>
            <SelectItem value="file">Files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !filters.dateRange?.start && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.start ? (
                  format(filters.dateRange.start, "PPP")
                ) : (
                  <span>Start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange?.start}
                onSelect={(date) => handleDateRangeChange('start', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !filters.dateRange?.end && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.end ? (
                  format(filters.dateRange.end, "PPP")
                ) : (
                  <span>End date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange?.end}
                onSelect={(date) => handleDateRangeChange('end', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Boolean Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasAttachments"
            checked={filters.hasAttachments || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ hasAttachments: checked as boolean })
            }
          />
          <Label htmlFor="hasAttachments">Has attachments</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasReactions"
            checked={filters.hasReactions || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ hasReactions: checked as boolean })
            }
          />
          <Label htmlFor="hasReactions">Has reactions</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasReplies"
            checked={filters.hasReplies || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ hasReplies: checked as boolean })
            }
          />
          <Label htmlFor="hasReplies">Has replies</Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={clearFilters} className="flex-1">
          Clear All
        </Button>
        <Button size="sm" onClick={onClose} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  );
}
