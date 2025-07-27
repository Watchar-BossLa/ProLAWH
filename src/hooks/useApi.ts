import { useState, useEffect } from 'react';
import apiClient from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<{data?: T; error?: string; status: number}>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.error) {
        setState({
          data: null,
          loading: false,
          error: response.error,
        });
      } else {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    refetch: execute,
  };
}

// Specific hooks for common API calls
export function useDashboardStats() {
  return useApi(() => apiClient.getDashboardStats());
}

export function useRecommendations() {
  return useApi(() => apiClient.getRecommendations());
}

export function useCourses(skip = 0, limit = 20) {
  return useApi(() => apiClient.getCourses(skip, limit));
}

export function useMentors(specialties?: string[], skip = 0, limit = 20) {
  return useApi(() => apiClient.getMentors(specialties, skip, limit));
}

export function useOpportunities(skip = 0, limit = 20) {
  return useApi(() => apiClient.getOpportunities(skip, limit));
}

export function useMyChats() {
  return useApi(() => apiClient.getMyChats());
}

export function useLearningAnalytics() {
  return useApi(() => apiClient.getLearningAnalytics());
}

export function useCurrentUser() {
  return useApi(() => apiClient.getCurrentUser());
}