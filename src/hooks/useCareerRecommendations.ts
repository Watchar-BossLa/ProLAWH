
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CareerRecommendation } from '@/types/career';
import { toast } from '@/hooks/use-toast';

export function useCareerRecommendations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get career recommendations with optional filtering
  const getRecommendations = async (type?: string, status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view recommendations'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Ensure the type field is properly typed as expected by CareerRecommendation
      const typedData: CareerRecommendation[] = data.map(item => ({
        ...item,
        type: item.type as 'skill_gap' | 'job_match' | 'mentor_suggest',
        status: item.status as 'pending' | 'accepted' | 'rejected' | 'implemented',
        resources: item.resources ? parseResources(item.resources) : undefined
      }));
      
      return typedData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching recommendations'));
      console.error('Error fetching career recommendations:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse resources from JSON
  const parseResources = (resources: any): { type: string; url?: string; title: string }[] => {
    if (Array.isArray(resources)) {
      return resources.map(resource => ({
        type: resource.type || 'link',
        url: resource.url,
        title: resource.title || 'Resource'
      }));
    }
    return [];
  };

  // Update recommendation status
  const updateRecommendationStatus = async (
    recommendationId: string,
    status: 'pending' | 'accepted' | 'rejected' | 'implemented'
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to update recommendations'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('career_recommendations')
        .update({ status })
        .eq('id', recommendationId)
        .eq('user_id', user.id);

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

  return {
    getRecommendations,
    updateRecommendationStatus,
    loading,
    error
  };
}
