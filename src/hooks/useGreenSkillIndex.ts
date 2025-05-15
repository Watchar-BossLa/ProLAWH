
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { mockGreenSkills } from "@/data/mockGreenSkillsData";

export interface GreenSkill {
  id: string;
  name: string;
  description: string;
  co2_score: number; // 0-100 scale
  category: string;
  demand_level: "high" | "medium" | "low";
  sdg_alignment: string[];
}

interface GreenSkillFilters {
  minScore?: number;
  category?: string;
  demandLevel?: string;
  searchTerm?: string;
  onlyGreen?: boolean;
}

export function useGreenSkillIndex() {
  const [filters, setFilters] = useState<GreenSkillFilters>({
    minScore: 0,
    onlyGreen: false,
  });
  
  // Fetch all green skills
  const {
    data: skills,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["green-skills"],
    queryFn: async () => {
      try {
        // Try to fetch from Supabase if available
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("co2_score", { ascending: false });
          
        // If there's an error or no data, use mock data
        if (error || !data || data.length === 0) {
          console.info("Using mock green skills data");
          return mockGreenSkills as GreenSkill[];
        }
        
        return data as GreenSkill[];
      } catch (error) {
        console.info("Falling back to mock green skills data");
        // Fall back to mock data if there's any error
        return mockGreenSkills as GreenSkill[];
      }
    }
  });
  
  // Apply filters to skills
  const filteredSkills = useCallback(() => {
    if (!skills) return [];
    
    return skills.filter(skill => {
      // Apply minimum score filter
      if (typeof filters.minScore === "number" && skill.co2_score < filters.minScore) {
        return false;
      }
      
      // Apply only green filter
      if (filters.onlyGreen && skill.co2_score < 50) {
        return false;
      }
      
      // Apply category filter
      if (filters.category && skill.category !== filters.category) {
        return false;
      }
      
      // Apply demand level filter
      if (filters.demandLevel && skill.demand_level !== filters.demandLevel) {
        return false;
      }
      
      // Apply search term filter
      if (filters.searchTerm && 
          !skill.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !skill.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [skills, filters]);
  
  // Update filters
  const updateFilters = useCallback((newFilters: Partial<GreenSkillFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Get top green skills
  const getTopGreenSkills = useCallback((limit: number = 5) => {
    if (!skills) return [];
    
    return [...skills]
      .sort((a, b) => b.co2_score - a.co2_score)
      .slice(0, limit);
  }, [skills]);
  
  // Group skills by category
  const getSkillsByCategory = useCallback(() => {
    if (!skills) return {};
    
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, GreenSkill[]>);
  }, [skills]);
  
  return {
    skills,
    filteredSkills: filteredSkills(),
    filters,
    updateFilters,
    isLoading,
    error,
    refetch,
    getTopGreenSkills,
    getSkillsByCategory
  };
}
