
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface CareerRecommendation {
  id: string;
  user_id: string;
  type: 'skill_gap' | 'job_match' | 'mentor_suggest';
  recommendation: string;
  relevance_score: number;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
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
      
      // Filter the results in memory since our mock client doesn't support filtering
      let filteredData = data || [];
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
      const { error } = await supabase
        .from('career_recommendations')
        .update({ status });

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('career_recommendations')
        .insert({
          user_id: userId,
          type,
          recommendation,
          relevance_score,
          status: 'pending'
        });

      if (error) throw error;
      return data;
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
