
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  rate_range: string;
  skills_required: string[];
  is_remote: boolean;
  has_insurance: boolean;
  green_score: number;
  created_at: string;
}
