
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GreenProject } from '@/types/projects';

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
    
    return data?.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      skillsNeeded: project.skills_needed || [],
      teamSize: project.team_size || 3,
      duration: project.duration || '3 months',
      category: project.category || 'General',
      impactArea: project.category || 'Community', // Using category as impactArea if not available
      location: project.location || '',
      deadline: project.deadline,
      carbonReduction: project.carbon_reduction || 0,
      sdgAlignment: project.sdg_alignment || [],
      compensation: project.compensation,
      hasInsurance: project.has_insurance || false,
      insuranceDetails: project.insurance_details || {}
    })) || [];
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
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });
  
  // Stub functions for project applications
  const hasUserApplied = (projectId: string) => false;
  const applyForProject = async (projectId: string, message: string) => {
    // Implementation would go here
    console.log(`Applied for project ${projectId} with message: ${message}`);
  };
  const createProject = async (projectData: Partial<GreenProject>) => {
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
