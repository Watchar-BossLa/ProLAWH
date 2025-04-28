
export interface GreenProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  teamSize: number;
  duration: string;
  category: string;
  impactArea: string;
  location?: string;
  deadline?: string;
  carbonReduction?: number;
  sdgAlignment?: number[];
  compensation?: string;
  hasInsurance?: boolean;
}
