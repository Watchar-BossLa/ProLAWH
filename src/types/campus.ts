
export interface CampusStats {
  universities: number;
  students: number;
  courses: number;
  badges: number;
}

export interface CampusConnection {
  id: string;
  name: string;
  domain: string;
  lmsType: string;
  status: string;
  studentCount: number;
  courseCount: number;
  badgeCount: number;
  lastSync: string;
}

export interface LTIConfig {
  consumerKey: string;
  sharedSecret: string;
  launchUrl: string;
  jwksUrl: string;
  redirectUrl: string;
}

export interface LTISetupGuide {
  lmsType: string;
  steps: LTISetupStep[];
}

export interface LTISetupStep {
  step: number;
  title: string;
  description: string;
  image?: string;
}
