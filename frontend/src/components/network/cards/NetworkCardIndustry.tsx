
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";

interface NetworkCardIndustryProps {
  industry?: string;
  careerPath?: string;
}

export function NetworkCardIndustry({ industry, careerPath }: NetworkCardIndustryProps) {
  if (!industry && !careerPath) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {industry && (
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{industry}</span>
        </div>
      )}
      
      {careerPath && (
        <div className="flex items-center gap-1">
          <GraduationCap className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{careerPath}</span>
        </div>
      )}
    </div>
  );
}
