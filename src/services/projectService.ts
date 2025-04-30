
import { supabase } from '@/integrations/supabase/client';
import { GreenProject, ProjectApplication } from '@/types/projects';
import { ApplicationResponseRecord } from '@/types/projectMarketplace';
import { mapProjectRecord, mapApplicationRecord, mapApplicationWithProfileRecord } from '@/utils/projectUtils';

/**
 * Fetch all projects from the database
 */
export async function fetchProjects(filterCategory: string = 'all'): Promise<GreenProject[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filterCategory !== 'all') {
    query = query.eq('category', filterCategory);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error fetching projects: ${error.message}`);
  }
  
  return (data || []).map(mapProjectRecord);
}

/**
 * Fetch applications for a specific user
 */
export async function fetchUserApplications(userId: string): Promise<ProjectApplication[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('project_applications')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error fetching applications: ${error.message}`);
  }

  return (data || []).map((app: ApplicationResponseRecord) => mapApplicationRecord(app));
}

/**
 * Apply for a project
 */
export async function applyForProject(userId: string, projectId: string, message: string): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('project_applications')
    .insert({
      user_id: userId,
      project_id: projectId,
      message,
      status: 'pending'
    });

  if (error) {
    throw new Error(`Error applying for project: ${error.message}`);
  }
}

/**
 * Create a new project
 */
export async function createProject(userId: string, projectData: Partial<GreenProject>): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('projects')
    .insert({
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      skills_needed: projectData.skillsNeeded,
      team_size: projectData.teamSize,
      duration: projectData.duration,
      impact_area: projectData.impactArea,
      location: projectData.location,
      deadline: projectData.deadline,
      carbon_reduction: projectData.carbonReduction,
      sdg_alignment: projectData.sdgAlignment,
      compensation: projectData.compensation,
      has_insurance: projectData.hasInsurance,
      insurance_details: projectData.insuranceDetails,
      created_by: userId,
      status: 'recruiting'
    });

  if (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }
}

/**
 * Update an existing project
 */
export async function updateProject(userId: string, projectId: string, projectData: Partial<GreenProject>): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('projects')
    .update({
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      skills_needed: projectData.skillsNeeded,
      team_size: projectData.teamSize,
      duration: projectData.duration,
      impact_area: projectData.impactArea,
      location: projectData.location,
      deadline: projectData.deadline,
      carbon_reduction: projectData.carbonReduction,
      sdg_alignment: projectData.sdgAlignment,
      compensation: projectData.compensation,
      has_insurance: projectData.hasInsurance,
      insurance_details: projectData.insuranceDetails,
      status: projectData.status
    })
    .eq('id', projectId)
    .eq('created_by', userId);

  if (error) {
    throw new Error(`Error updating project: ${error.message}`);
  }
}

/**
 * Delete a project
 */
export async function deleteProject(userId: string, projectId: string): Promise<void> {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('created_by', userId);

  if (error) {
    throw new Error(`Error deleting project: ${error.message}`);
  }
}

/**
 * Update the status of an application
 */
export async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected'): Promise<void> {
  const { error } = await supabase
    .from('project_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) {
    throw new Error(`Error updating application: ${error.message}`);
  }
}

/**
 * Fetch applications for a specific project
 */
export async function fetchProjectApplications(projectId: string): Promise<(ProjectApplication & { profile?: any })[]> {
  if (!projectId) return [];

  try {
    const { data, error } = await supabase
      .from('project_applications')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('project_id', projectId);

    if (error) {
      throw new Error(`Error fetching project applications: ${error.message}`);
    }

    return (data || []).map(mapApplicationWithProfileRecord);
  } catch (error) {
    console.error("Error fetching project applications:", error);
    return [];
  }
}
