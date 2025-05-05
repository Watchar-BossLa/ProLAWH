
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { MockData, MentorRecommendation } from '@/types/mocks';

interface MentorDetails {
  id: string;
  expertise: string[];
  fullName: string;
  avatarUrl?: string;
  yearsOfExperience?: number;
  bio?: string;
  availability?: string;
  isAcceptingMentees?: boolean;
}

export function useCareerTwinMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Query to get mentor recommendations from AI Career Twin
  const { data: mentorRecommendations, isLoading } = useQuery({
    queryKey: ['mentor-recommendations'],
    queryFn: async () => {
      if (!user) return [];
      // This would normally fetch from a career-twin edge function
      // Here we'll return mock data
      return [
        {
          id: '1',
          mentorId: 'mentor-1',
          reason: 'Based on your career goals in sustainability',
          recommendationId: 'rec-123',
          score: 0.95,
        },
        {
          id: '2',
          mentorId: 'mentor-2',
          reason: 'Matches your interest in green technologies',
          recommendationId: 'rec-456',
          score: 0.87,
        }
      ];
    },
    enabled: !!user
  });

  // Get a list of mentors recommended by Career Twin
  const getRecommendedMentors = async (limit: number = 5) => {
    if (!user) {
      setError(new Error('You must be logged in to view recommended mentors'));
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from the career twin API
      // For now, we'll just fetch from the mentors table
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          id, 
          expertise,
          profiles:id(full_name, avatar_url), 
          years_of_experience,
          bio, 
          availability,
          is_accepting_mentees
        `)
        .limit(limit);

      if (error) throw error;

      if (data && Array.isArray(data)) {
        // Transform the mock data to match our expected interface
        return data.map((item: MockData) => ({
          id: item.id,
          expertise: item.expertise || [],
          profiles: item.profiles || { full_name: 'Unknown Mentor', avatar_url: '' },
          years_of_experience: item.years_of_experience || 0,
          bio: item.bio || '',
          availability: item.availability || '',
          is_accepting_mentees: item.is_accepting_mentees !== false
        }));
      }
      
      return [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching recommended mentors'));
      console.error('Error fetching recommended mentors:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get details for a specific mentor
  const getMentorDetails = async (mentorId: string): Promise<MentorDetails | null> => {
    if (!user) {
      setError(new Error('You must be logged in to view mentor details'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          id, 
          expertise,
          profiles:id(full_name, avatar_url),
          years_of_experience, 
          bio, 
          availability,
          is_accepting_mentees
        `)
        .eq('id', mentorId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Transform the mock data
        const item = data as MockData;
        const profile = item.profiles || { full_name: 'Unknown Mentor', avatar_url: '' };
        
        return {
          id: item.id,
          expertise: item.expertise || [],
          fullName: profile.full_name || 'Unknown Mentor',
          avatarUrl: profile.avatar_url,
          yearsOfExperience: item.years_of_experience,
          bio: item.bio || '',
          availability: item.availability || '',
          isAcceptingMentees: item.is_accepting_mentees !== false
        };
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentor details'));
      console.error('Error fetching mentor details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Request mentorship based on Career Twin recommendation
  const requestMentorship = useMutation({
    mutationFn: async ({
      mentorId,
      message,
      focusAreas,
      industry,
      recommendationId
    }: {
      mentorId: string;
      message: string;
      focusAreas: string[];
      industry: string;
      recommendationId: string;
    }) => {
      if (!user) {
        throw new Error('You must be logged in to request mentorship');
      }
      
      // Create a mentorship request
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          requester_id: user.id,
          mentor_id: mentorId,
          message,
          focus_areas: focusAreas,
          industry,
          status: 'pending',
          // Link this request to the Career Twin recommendation
          metadata: { career_twin_recommendation_id: recommendationId }
        });
      
      if (error) throw error;

      return true;
    },
    onSuccess: () => {
      toast({
        title: "Request Sent",
        description: "Your mentorship request has been sent. You'll receive a notification when they respond.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    loading,
    error,
    mentorRecommendations,
    isLoading,
    getRecommendedMentors,
    getMentorDetails,
    requestMentorship
  };
}
