
import { Badge } from "@/components/ui/badge";

interface MentorshipFocusAreasProps {
  focusAreas: string[];
  industry?: string;
}

export function MentorshipFocusAreas({ focusAreas, industry }: MentorshipFocusAreasProps) {
  return (
    <>
      <div>
        <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
        <div className="flex flex-wrap gap-1">
          {focusAreas.map((area, i) => (
            <Badge key={i} variant="secondary">{area}</Badge>
          ))}
        </div>
      </div>
      
      {industry && (
        <div>
          <h4 className="text-sm font-medium mb-2">Industry</h4>
          <Badge>{industry}</Badge>
        </div>
      )}
    </>
  );
}
