
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { SearchFilters as SearchFiltersType } from "@/hooks/useMessageSearch";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClose: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onClose }: SearchFiltersProps) {
  const clearAllFilters = () => {
    onFiltersChange({
      sender: undefined,
      dateRange: undefined,
      messageType: undefined,
      hasReactions: undefined,
      hasReplies: undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Search Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sender filter */}
      <div className="space-y-2">
        <Label htmlFor="sender">Sender</Label>
        <Input
          id="sender"
          placeholder="Filter by sender name..."
          value={filters.sender || ''}
          onChange={(e) => onFiltersChange({ sender: e.target.value || undefined })}
        />
      </div>

      {/* Date range filter */}
      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.start ? format(filters.dateRange.start, "MMM dd") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange?.start}
                onSelect={(date) => date && onFiltersChange({
                  dateRange: { 
                    start: date, 
                    end: filters.dateRange?.end || date 
                  }
                })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.end ? format(filters.dateRange.end, "MMM dd") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange?.end}
                onSelect={(date) => date && onFiltersChange({
                  dateRange: { 
                    start: filters.dateRange?.start || date, 
                    end: date 
                  }
                })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Message type filter */}
      <div className="space-y-2">
        <Label>Message Type</Label>
        <Select 
          value={filters.messageType || 'all'} 
          onValueChange={(value) => onFiltersChange({ 
            messageType: value === 'all' ? undefined : value as any 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select message type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="text">Text messages</SelectItem>
            <SelectItem value="file">File attachments</SelectItem>
            <SelectItem value="image">Images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reaction filter */}
      <div className="flex items-center justify-between">
        <Label htmlFor="has-reactions">Has reactions</Label>
        <Switch
          id="has-reactions"
          checked={filters.hasReactions || false}
          onCheckedChange={(checked) => onFiltersChange({ hasReactions: checked || undefined })}
        />
      </div>

      {/* Replies filter */}
      <div className="flex items-center justify-between">
        <Label htmlFor="has-replies">Has replies</Label>
        <Switch
          id="has-replies"
          checked={filters.hasReplies || false}
          onCheckedChange={(checked) => onFiltersChange({ hasReplies: checked || undefined })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAllFilters}
          disabled={!hasActiveFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button size="sm" onClick={onClose} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
