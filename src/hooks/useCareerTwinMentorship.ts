
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Define safe accessor helper
const getSafeProperty = <T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] => {
  if (!obj) return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

export function useCareerTwinMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get recommended mentors for the current user
  const getRecommendedMentors = async (limit: number = 3) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentor recommendations'));
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:id(full_name, avatar_url)
        `)
        .limit(limit);

      if (error) throw error;
      
      // Transform data to ensure it has all needed properties
      return data ? data.map(mentor => ({
        id: getSafeProperty(mentor, 'id', ''),
        expertise: getSafeProperty(mentor, 'expertise', []),
        profiles: getSafeProperty(mentor, 'profiles', { 
          full_name: 'Unknown Mentor', 
          avatar_url: null 
        }),
        // Add other properties with safe defaults
        years_of_experience: getSafeProperty(mentor, 'years_of_experience', 0),
        bio: getSafeProperty(mentor, 'bio', ''),
        availability: getSafeProperty(mentor, 'availability', ''),
        is_accepting_mentees: getSafeProperty(mentor, 'is_accepting_mentees', true)
      })) : [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentor recommendations'));
      console.error('Error fetching mentor recommendations:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a specific mentor's details
  const getMentorDetails = async (mentorId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentor details'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:id(full_name, avatar_url)
        `)
        .eq('id', mentorId)
        .single();

      const mentor = response.data;
      
      if (response.error) throw response.error;
      
      return mentor ? {
        id: getSafeProperty(mentor, 'id', ''),
        expertise: getSafeProperty(mentor, 'expertise', []),
        profiles: getSafeProperty(mentor, 'profiles', { 
          full_name: 'Unknown Mentor', 
          avatar_url: null 
        }),
        // Add other properties with safe defaults
        years_of_experience: getSafeProperty(mentor, 'years_of_experience', 0),
        bio: getSafeProperty(mentor, 'bio', ''),
        availability: getSafeProperty(mentor, 'availability', ''),
        is_accepting_mentees: getSafeProperty(mentor, 'is_accepting_mentees', true)
      } : null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentor details'));
      console.error('Error fetching mentor details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Request mentorship with a mentor
  const requestMentorship = async (
    mentorId: string, 
    message: string, 
    focusAreas: string[], 
    industry: string,
    expectedDuration: string,
    goals: string[]
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to request mentorship'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          requester_id: user.id,
          mentor_id: mentorId,
          message,
          focus_areas: focusAreas,
          industry,
          expected_duration: expectedDuration,
          goals,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: 'Mentorship Request Sent',
        description: 'Your mentorship request has been sent successfully.',
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error requesting mentorship'));
      console.error('Error requesting mentorship:', err);
      
      toast({
        title: 'Request Failed',
        description: 'Failed to send mentorship request. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRecommendedMentors,
    getMentorDetails,
    requestMentorship
  };
}
