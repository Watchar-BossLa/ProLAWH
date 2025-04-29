
import { Globe } from "lucide-react";

export function NoProjectsFound() {
  return (
    <div className="text-center py-10">
      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium">No matching projects</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Try adjusting your search or filters to find more opportunities
      </p>
    </div>
  );
}
