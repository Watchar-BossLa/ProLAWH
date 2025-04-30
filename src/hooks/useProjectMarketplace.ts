
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GreenProject, ProjectApplication, ProjectFilters } from '@/types/projects';
import { withDefaults } from '@/utils/typeUtils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';

// Define a type for the raw database project response
interface ProjectRecord {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  skills_needed?: string[] | null;
  team_size?: number | null;
  duration?: string | null;
  impact_area?: string | null;
  location?: string | null;
  deadline?: string | null;
  carbon_reduction?: number | null;
  sdg_alignment?: string[] | null;
  compensation?: string | null;
  has_insurance?: boolean | null;
  insurance_details?: Record<string, string> | null;
  created_by?: string | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

// Define a type for the raw database application response
interface ApplicationRecord {
  id: string;
  user_id: string;
  project_id: string;
  status: string;
  message?: string | null;
  // Make applied_at optional since it might not be in the database response
  applied_at?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

export function useProjectMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchProjects = async (): Promise<GreenProject[]> => {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filterCategory !== 'all') {
      query = query.eq('category', filterCategory);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(`Error fetching projects: ${error.message}`);
    }
    
    return (data || []).map((project: ProjectRecord) => {
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
    });
  };
  
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', filterCategory],
    queryFn: fetchProjects
  });
  
  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      return (
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  // Fetch applications for the current user
  const fetchUserApplications = async (): Promise<ProjectApplication[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('project_applications')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive"
      });
      throw new Error(`Error fetching applications: ${error.message}`);
    }

    return (data || []).map((app: Record<string, any>) => ({
      id: app.id,
      userId: app.user_id,
      projectId: app.project_id,
      status: app.status as 'pending' | 'accepted' | 'rejected',
      appliedAt: app.applied_at || app.created_at, // Fallback to created_at if applied_at doesn't exist
      message: app.message
    }));
  };

  const {
    data: userApplications = [],
    isLoading: isLoadingApplications,
    refetch: refetchApplications
  } = useQuery({
    queryKey: ['userApplications', user?.id],
    queryFn: fetchUserApplications,
    enabled: !!user
  });
  
  const hasUserApplied = (projectId: string): boolean => {
    return userApplications.some(app => app.projectId === projectId);
  };
  
  const applyForProject = async (projectId: string, message: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for projects",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_applications')
        .insert({
          user_id: user.id,
          project_id: projectId,
          message,
          status: 'pending'
        });

      if (error) {
        toast({
          title: "Application Failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error applying for project: ${error.message}`);
      }

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['userApplications', user.id] });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createProject = async (projectData: Partial<GreenProject>): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create projects",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
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
          created_by: user.id,
          status: 'recruiting'
        });

      if (error) {
        toast({
          title: "Project Creation Failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error creating project: ${error.message}`);
      }

      toast({
        title: "Project Created",
        description: "Your project has been created successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast({
        title: "Project Creation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProject = async (projectId: string, projectData: Partial<GreenProject>): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to update projects",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
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
        .eq('created_by', user.id);

      if (error) {
        toast({
          title: "Project Update Failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error updating project: ${error.message}`);
      }

      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast({
        title: "Project Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete projects",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('created_by', user.id);

      if (error) {
        toast({
          title: "Project Deletion Failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error deleting project: ${error.message}`);
      }

      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast({
        title: "Project Deletion Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected'): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to update applications",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('project_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        toast({
          title: "Status Update Failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error updating application: ${error.message}`);
      }

      toast({
        title: "Application Updated",
        description: `The application has been ${status}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['userApplications'] });
      queryClient.invalidateQueries({ queryKey: ['projectApplications'] });
    } catch (error) {
      toast({
        title: "Status Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch applications for a specific project
  const fetchProjectApplications = async (projectId: string): Promise<ProjectApplication[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('project_applications')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('project_id', projectId);

      if (error) {
        toast({
          title: "Error fetching applications",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(`Error fetching project applications: ${error.message}`);
      }

      return (data || []).map((app: Record<string, any>) => ({
        id: app.id,
        userId: app.user_id,
        projectId: app.project_id,
        status: app.status as 'pending' | 'accepted' | 'rejected',
        appliedAt: app.applied_at || app.created_at, // Safely handle missing applied_at field
        message: app.message,
        profile: app.profiles
      }));
    } catch (error) {
      // If there's an error with the SQL query, return an empty array
      console.error("Error fetching project applications:", error);
      return [];
    }
  };
  
  return {
    projects: filteredProjects,
    userApplications,
    isLoading,
    isLoadingApplications,
    isError,
    error,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    refetch,
    refetchApplications,
    hasUserApplied,
    applyForProject,
    createProject,
    updateProject,
    deleteProject,
    updateApplicationStatus,
    fetchProjectApplications,
    isSubmitting
  };
}
