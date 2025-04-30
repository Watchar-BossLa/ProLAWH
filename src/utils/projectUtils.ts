
import { ProjectRecord, ApplicationResponseRecord } from '@/types/projectMarketplace';
import { GreenProject, ProjectApplication } from '@/types/projects';
import { withDefaults } from '@/utils/typeUtils';

/**
 * Maps a project record from the database to a GreenProject object
 */
export function mapProjectRecord(project: ProjectRecord): GreenProject {
  // Set default values for fields that might be missing in the database
  const defaults = {
    teamSize: project.team_size || 3,
    duration: project.duration || '3 months',
    impactArea: project.impact_area || project.category || 'Community',
    location: project.location || '',
    carbonReduction: project.carbon_reduction || 0,
    sdgAlignment: Array.isArray(project.sdg_alignment) ? project.sdg_alignment : [],
    hasInsurance: project.has_insurance || false,
    insuranceDetails: project.insurance_details || {},
    createdBy: project.created_by || null,
    status: project.status || 'recruiting'
  };

  return withDefaults<GreenProject, keyof typeof defaults>({
    id: project.id,
    title: project.title,
    description: project.description || '',
    skillsNeeded: Array.isArray(project.skills_needed) ? project.skills_needed : [],
    category: project.category || 'General',
    deadline: project.deadline,
    compensation: project.compensation
  }, defaults);
}

/**
 * Maps an application record from the database to a ProjectApplication object
 */
export function mapApplicationRecord(app: ApplicationResponseRecord): ProjectApplication {
  return {
    id: app.id,
    userId: app.user_id,
    projectId: app.project_id,
    status: app.status as 'pending' | 'accepted' | 'rejected',
    appliedAt: app.applied_at || app.created_at, // Fallback to created_at if applied_at doesn't exist
    message: app.message
  };
}

/**
 * Maps an application record with profile from the database to a ProjectApplication object
 */
export function mapApplicationWithProfileRecord(app: Record<string, any>): ProjectApplication & { profile?: any } {
  return {
    id: app.id,
    userId: app.user_id,
    projectId: app.project_id,
    status: app.status as 'pending' | 'accepted' | 'rejected',
    appliedAt: app.applied_at || app.created_at, // Safely handle missing applied_at field
    message: app.message,
    profile: app.profiles
  };
}
