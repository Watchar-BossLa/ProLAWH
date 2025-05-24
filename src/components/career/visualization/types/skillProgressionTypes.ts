
export interface OverviewDataPoint {
  month: string;
  current: number | null;
  projected: number;
  marketAverage: number;
}

export interface SkillDataPoint {
  month: string;
  skill: string;
  current: number | null;
  projected: number;
  marketLevel: number;
}

export type ViewType = 'overview' | 'specific';

export interface ProgressData {
  overview: OverviewDataPoint[];
  skills: Record<string, SkillDataPoint[]>;
}
