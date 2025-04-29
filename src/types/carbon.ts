
export interface CarbonActivity {
  name: string;
  category: string;
  icon: string;
  impactPerUnit: number;
  unit: string;
  frequency: string;
  value: number;
  maxValue: number;
}

export interface CategoryBreakdown {
  [category: string]: number;
}

export interface SavedCarbonData {
  total_impact: number;
  activities: CarbonActivity[];
  category_breakdown: CategoryBreakdown;
  created_at: string;
}
