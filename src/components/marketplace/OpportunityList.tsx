
import { OpportunityCard } from "./OpportunityCard";
import { Briefcase } from "lucide-react";
import type { Opportunity } from "@/types/marketplace";

interface OpportunityListProps {
  opportunities: Opportunity[] | undefined;
  isLoading: boolean;
}

export function OpportunityList({ opportunities, isLoading }: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[300px] bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!opportunities?.length) {
    return (
      <div className="col-span-2 text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No opportunities found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {opportunities.map(opportunity => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
