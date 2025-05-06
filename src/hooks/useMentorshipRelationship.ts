
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useMentorshipRelationship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMentorshipRelationships = async (status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentorships'));
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      // Return mock data
      return [
        {
          id: "mock-rel-1",
          mentor_id: "mock-mentor-1",
          mentee_id: user.id,
          status: "active",
          focus_areas: ["Web Development", "Career Growth"],
          goals: "Learn React, Get promoted",
          meeting_frequency: "weekly",
          mentor: {
            id: "mock-mentor-1",
            profiles: {
              full_name: "Jane Mentor",
              avatar_url: "/assets/mentor1.jpg"
            }
          }
        }
      ];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentorships'));
      console.error('Error fetching mentorship relationships:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMentorshipRelationships,
  };
}
