
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GreenProject, ProjectApplication } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchProjects, 
  fetchUserApplications, 
  applyForProject as apiApplyForProject,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  updateApplicationStatus as apiUpdateApplicationStatus,
  fetchProjectApplications as apiFetchProjectApplications
} from '@/services/projectService';

export function useProjectMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch projects query
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects', filterCategory],
    queryFn: () => fetchProjects(filterCategory)
  });
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      return (
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  // Fetch user applications query
  const {
    data: userApplications = [],
    isLoading: isLoadingApplications,
    refetch: refetchApplications
  } = useQuery({
    queryKey: ['userApplications', user?.id],
    queryFn: () => user ? fetchUserApplications(user.id) : Promise.resolve([]),
    enabled: !!user
  });
  
  // Check if user has applied to a project
  const hasUserApplied = (projectId: string): boolean => {
    return userApplications.some(app => app.projectId === projectId);
  };
  
  // Apply for a project
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
      await apiApplyForProject(user.id, projectId, message);
      
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
  
  // Create a new project
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
      await apiCreateProject(user.id, projectData);
      
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

  // Update an existing project
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
      await apiUpdateProject(user.id, projectId, projectData);
      
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

  // Delete a project
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
      await apiDeleteProject(user.id, projectId);
      
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

  // Update application status
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
      await apiUpdateApplicationStatus(applicationId, status);
      
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
    return apiFetchProjectApplications(projectId);
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
