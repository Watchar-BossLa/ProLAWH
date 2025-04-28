
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MentorshipFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search mentors or mentees..."
          className="pl-8"
        />
      </div>
      
      <div className="flex gap-2">
        <div className="w-40">
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Focus Areas</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="leadership">Leadership</SelectItem>
              <SelectItem value="career">Career Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-40">
          <Select defaultValue="newest">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
