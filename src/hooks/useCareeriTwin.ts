
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { MockData } from '@/types/mocks';

export interface CareerRecommendation {
  id: string;
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
  skills?: string[];
}

export function useCareerTwin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get career recommendations for the current user
  const getRecommendations = async (type?: string, status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view recommendations'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      // Updated to work with the mock client
      const { data, error } = await supabase
        .from('career_recommendations')
        .select();

      if (error) throw error;
      
      // Filter the results in memory and ensure they have required properties
      let filteredData = data && Array.isArray(data) ? data.map((item: MockData) => ({
        id: item.id,
        user_id: item.user_id || user.id,
        type: (item.type as 'skill_gap' | 'job_match' | 'mentor_suggest') || 'skill_gap',
        recommendation: item.recommendation || '',
        relevance_score: item.relevance_score || 0,
        status: item.status || 'pending',
        created_at: item.created_at || new Date().toISOString(),
        skills: item.skills ? (Array.isArray(item.skills) ? item.skills : [typeof item.skills === 'object' ? item.skills.name : '']) : []
      })) : [];
      
      // Apply additional filters if provided
      if (type) {
        filteredData = filteredData.filter(item => item.type === type);
      }
      if (status) {
        filteredData = filteredData.filter(item => item.status === status);
      }
      
      return filteredData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching recommendations'));
      console.error('Error fetching career recommendations:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update recommendation status
  const updateRecommendationStatus = async (
    recommendationId: string,
    status: 'accepted' | 'rejected' | 'implemented'
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to update recommendations'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      // Updated to work with the mock client
      const response = await supabase
        .from('career_recommendations')
        .update({ status });
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Status Updated',
        description: `Recommendation status updated to ${status}.`,
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating recommendation'));
      console.error('Error updating recommendation status:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update the recommendation status.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a recommendation (for admin/system use)
  const addRecommendation = async (
    userId: string,
    type: 'skill_gap' | 'job_match' | 'mentor_suggest',
    recommendation: string,
    relevance_score: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Updated to work with the mock client
      const response = await supabase
        .from('career_recommendations')
        .insert({
          user_id: userId,
          type,
          recommendation,
          relevance_score,
          status: 'pending'
        });
      
      if (response.error) throw response.error;
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding recommendation'));
      console.error('Error adding career recommendation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRecommendations,
    updateRecommendationStatus,
    addRecommendation
  };
}
