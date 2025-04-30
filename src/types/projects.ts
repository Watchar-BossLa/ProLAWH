
export interface GreenProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  teamSize: number;
  duration: string;
  category: string;
  impactArea: string;
  location: string;
  deadline?: string;
  carbonReduction: number;
  sdgAlignment: string[];
  compensation?: string;
  hasInsurance: boolean;
  insuranceDetails: Record<string, string>;
  createdBy?: string;
  status?: string;
}

export interface ProjectApplication {
  id: string;
  userId: string;
  projectId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarUrl?: string;
}

export interface ProjectTeam {
  projectId: string;
  members: TeamMember[];
  skillsCoverage: number;
  missingSkills: string[];
}

export interface ProjectFilters {
  category: string;
  impactArea?: string;
  hasInsurance?: boolean;
  searchQuery?: string;
}
