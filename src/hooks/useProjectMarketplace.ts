
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GreenProject } from '@/types/projects';
import { withDefaults } from '@/utils/typeUtils';

export function useProjectMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
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
      throw new Error(`Error fetching projects: ${error.message}`);
    }
    
    return (data || []).map(project => {
      // Set default values for fields that might be missing in the database
      const defaults = {
        teamSize: 3,
        duration: '3 months',
        impactArea: project.category || 'Community',
        location: '',
        carbonReduction: 0,
        sdgAlignment: [] as string[],
        hasInsurance: false,
        insuranceDetails: {} as Record<string, string>
      };

      return withDefaults<GreenProject, keyof typeof defaults>({
        id: project.id,
        title: project.title,
        description: project.description,
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
  
  // Stub functions for project applications
  const hasUserApplied = (projectId: string): boolean => false;
  
  const applyForProject = async (projectId: string, message: string): Promise<void> => {
    // Implementation would go here
    console.log(`Applied for project ${projectId} with message: ${message}`);
  };
  
  const createProject = async (projectData: Partial<GreenProject>): Promise<void> => {
    // Implementation would go here
    console.log('Creating project:', projectData);
  };
  
  return {
    projects: filteredProjects,
    isLoading,
    isError,
    error,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    refetch,
    // Add these functions to the return value
    hasUserApplied,
    applyForProject,
    createProject,
    isSubmitting: false // Stub for now
  };
}
