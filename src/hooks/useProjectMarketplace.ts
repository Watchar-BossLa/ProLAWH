
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { GreenProject, ProjectApplication } from '@/types/projects';

export function useProjectMarketplace() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<GreenProject[]>([]);
  const [userApplications, setUserApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('green_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the raw data into our GreenProject type
      setProjects(data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        skillsNeeded: project.skills_needed || [],
        teamSize: project.team_size,
        duration: project.duration,
        category: project.category,
        impactArea: project.impact_area,
        location: project.location,
        deadline: project.deadline,
        carbonReduction: project.carbon_reduction,
        sdgAlignment: project.sdg_alignment,
        compensation: project.compensation,
        hasInsurance: project.has_insurance,
        insuranceDetails: project.insurance_details
      })));
      
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_applications')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUserApplications(data.map(app => ({
        id: app.id,
        userId: app.user_id,
        projectId: app.project_id,
        status: app.status as 'pending' | 'accepted' | 'rejected',
        appliedAt: app.applied_at,
        message: app.message
      })));
      
    } catch (error: any) {
      console.error('Error fetching user applications:', error);
    }
  };

  const applyForProject = async (projectId: string, message: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for projects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if the user has already applied
      const hasApplied = userApplications.some(app => app.projectId === projectId);
      
      if (hasApplied) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this project"
        });
        return;
      }
      
      const { error } = await supabase
        .from('project_applications')
        .insert({
          project_id: projectId,
          user_id: user.id,
          message: message,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully"
      });
      
      // Refresh user applications
      fetchUserApplications();
      
    } catch (error: any) {
      console.error('Error applying for project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createProject = async (projectData: Omit<GreenProject, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create projects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('green_projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          impact_area: projectData.impactArea,
          team_size: projectData.teamSize,
          duration: projectData.duration,
          location: projectData.location,
          deadline: projectData.deadline,
          carbon_reduction: projectData.carbonReduction,
          sdg_alignment: projectData.sdgAlignment,
          compensation: projectData.compensation,
          skills_needed: projectData.skillsNeeded,
          has_insurance: projectData.hasInsurance,
          insurance_details: projectData.insuranceDetails,
          created_by: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Your green project has been created successfully"
      });
      
      // Refresh projects list
      fetchProjects();
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUserApplied = (projectId: string) => {
    return userApplications.some(app => app.projectId === projectId);
  };

  return {
    projects,
    userApplications,
    isLoading,
    isSubmitting,
    applyForProject,
    createProject,
    hasUserApplied,
    refreshProjects: fetchProjects
  };
}
