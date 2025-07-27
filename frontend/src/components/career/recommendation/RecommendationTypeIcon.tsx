
import { 
  BarChart, 
  Briefcase, 
  GraduationCap,
  Lightbulb
} from "lucide-react";

type RecommendationTypeIconProps = {
  type: string;
};

export function RecommendationTypeIcon({ type }: RecommendationTypeIconProps) {
  switch(type) {
    case 'skill_gap':
      return <GraduationCap className="h-5 w-5 text-emerald-500" />;
    case 'job_match':
      return <Briefcase className="h-5 w-5 text-blue-500" />;
    case 'mentor_suggest':
      return <Lightbulb className="h-5 w-5 text-amber-500" />;
    default:
      return <BarChart className="h-5 w-5 text-violet-500" />;
  }
}

export function getRecommendationTitle(type: string): string {
  switch(type) {
    case 'skill_gap':
      return "Skill Development";
    case 'job_match':
      return "Career Opportunity";
    case 'mentor_suggest':
      return "Mentorship Suggestion";
    default:
      return "AI Recommendation";
  }
}
