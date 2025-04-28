
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface MentorProfile {
  id: string;
  expertise: string[];
  years_of_experience?: number;
  bio?: string;
  availability?: string;
  max_mentees: number;
  is_accepting_mentees: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorshipRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  created_at: string;
  updated_at: string;
  end_date?: string;
  status: 'pending' | 'active' | 'completed' | 'declined' | 'paused';
  focus_areas?: string[];
  goals?: string;
  meeting_frequency?: string;
  feedback?: string;
}

export interface MentorshipSession {
  id: string;
  relationship_id: string;
  scheduled_for: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  mentor_feedback?: string;
  mentee_feedback?: string;
  mentor_rating?: number;
  mentee_rating?: number;
}

export interface MentorshipProgress {
  id: string;
  mentorship_id: string;
  milestone: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface MentorshipResource {
  id: string;
  mentorship_id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'other';
  url?: string;
  description?: string;
  added_by: string;
  added_at: string;
  completed?: boolean;
}

export interface MentorshipRequest {
  id: string;
  requester_id: string;
  mentor_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  focus_areas: string[];
  industry: string;
  expected_duration?: string;
  goals?: string[];
}

export function useMentorship() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get all mentors
  const getMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:id(full_name, avatar_url)
        `);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentors'));
      console.error('Error fetching mentors:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send mentorship request
  const sendMentorshipRequest = async (request: Omit<MentorshipRequest, 'id' | 'requester_id' | 'status' | 'created_at'>) => {
    if (!user) {
      setError(new Error('You must be logged in to send a mentorship request'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const newRequest = {
        requester_id: user.id,
        status: 'pending',
        ...request
      };

      const { data, error } = await supabase
        .from('mentorship_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Mentorship Request Sent',
        description: 'Your mentorship request has been sent successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error sending mentorship request'));
      console.error('Error sending mentorship request:', err);
      
      toast({
        title: 'Request Failed',
        description: 'Failed to send mentorship request. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle mentorship request response (accept/decline)
  const respondToMentorshipRequest = async (requestId: string, accept: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to respond to requests'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      // First, update the request status
      const { data: updatedRequest, error: updateError } = await supabase
        .from('mentorship_requests')
        .update({ status: accept ? 'accepted' : 'declined' })
        .eq('id', requestId)
        .eq('mentor_id', user.id) // Only the mentor can respond
        .select()
        .single();

      if (updateError) throw updateError;

      if (accept) {
        // Create a new mentorship relationship
        const { data: request } = await supabase
          .from('mentorship_requests')
          .select()
          .eq('id', requestId)
          .single();

        if (!request) throw new Error('Request not found');

        const relationship = {
          mentor_id: request.mentor_id,
          mentee_id: request.requester_id,
          status: 'active',
          focus_areas: request.focus_areas,
          goals: request.goals ? request.goals.join('\n') : null,
        };

        const { data: mentorship, error: createError } = await supabase
          .from('mentorship_relationships')
          .insert(relationship)
          .select()
          .single();

        if (createError) throw createError;

        toast({
          title: 'Mentorship Accepted',
          description: 'You have successfully accepted the mentorship request.',
        });

        return mentorship;
      }

      toast({
        title: 'Request Declined',
        description: 'You have declined the mentorship request.',
      });

      return updatedRequest;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error responding to request'));
      console.error('Error responding to mentorship request:', err);
      
      toast({
        title: 'Action Failed',
        description: 'Failed to process your response. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship relationships for current user
  const getMentorshipRelationships = async (status?: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view mentorships'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('mentorship_relationships')
        .select(`
          *,
          mentor:mentor_id(id, profiles:id(full_name, avatar_url)),
          mentee:mentee_id(id, profiles:id(full_name, avatar_url))
        `)
        .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching mentorships'));
      console.error('Error fetching mentorship relationships:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Schedule a mentorship session
  const scheduleMentorshipSession = async (
    relationshipId: string, 
    scheduledFor: Date, 
    durationMinutes: number, 
    notes?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to schedule sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const session = {
        relationship_id: relationshipId,
        scheduled_for: scheduledFor.toISOString(),
        duration_minutes: durationMinutes,
        notes,
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Session Scheduled',
        description: 'Your mentorship session has been scheduled successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error scheduling session'));
      console.error('Error scheduling mentorship session:', err);
      
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule the session. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update session status and add feedback/rating
  const updateSessionFeedback = async (
    sessionId: string,
    status: 'completed' | 'cancelled' | 'rescheduled',
    isMentor: boolean,
    feedback?: string,
    rating?: number
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to update sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const updates = {
        status,
        ...(isMentor
          ? { mentor_feedback: feedback, mentor_rating: rating }
          : { mentee_feedback: feedback, mentee_rating: rating }),
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Feedback Saved',
        description: 'Your feedback has been saved successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating session'));
      console.error('Error updating mentorship session:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to save your feedback. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add progress milestone
  const addProgressMilestone = async (
    mentorshipId: string,
    milestone: string,
    completed: boolean = false,
    notes?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to add progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const progressItem = {
        mentorship_id: mentorshipId,
        milestone,
        completed,
        notes,
      };

      const { data, error } = await supabase
        .from('mentorship_progress')
        .insert(progressItem)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Progress Updated',
        description: 'Mentorship progress has been updated successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding progress'));
      console.error('Error adding mentorship progress:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update progress milestone completion status
  const updateProgressStatus = async (progressId: string, completed: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to update progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_progress')
        .update({ completed })
        .eq('id', progressId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Progress Updated',
        description: `Milestone marked as ${completed ? 'completed' : 'incomplete'}.`,
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating progress'));
      console.error('Error updating mentorship progress:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update milestone status. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add resource to mentorship
  const addMentorshipResource = async (
    mentorshipId: string,
    title: string,
    type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'other',
    url?: string,
    description?: string
  ) => {
    if (!user) {
      setError(new Error('You must be logged in to add resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const resource = {
        mentorship_id: mentorshipId,
        title,
        type,
        url,
        description,
        added_by: user.id,
      };

      const { data, error } = await supabase
        .from('mentorship_resources')
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Resource Added',
        description: 'Your resource has been added successfully.',
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error adding resource'));
      console.error('Error adding mentorship resource:', err);
      
      toast({
        title: 'Failed to Add Resource',
        description: 'Could not add the resource. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update resource completion status
  const updateResourceStatus = async (resourceId: string, completed: boolean) => {
    if (!user) {
      setError(new Error('You must be logged in to update resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_resources')
        .update({ completed })
        .eq('id', resourceId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Resource Updated',
        description: `Resource marked as ${completed ? 'completed' : 'incomplete'}.`,
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error updating resource'));
      console.error('Error updating mentorship resource:', err);
      
      toast({
        title: 'Update Failed',
        description: 'Failed to update resource status. Please try again.',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship sessions for a relationship
  const getMentorshipSessions = async (relationshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view sessions'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('relationship_id', relationshipId)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching sessions'));
      console.error('Error fetching mentorship sessions:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship progress for a relationship
  const getMentorshipProgress = async (mentorshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view progress'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_progress')
        .select('*')
        .eq('mentorship_id', mentorshipId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching progress'));
      console.error('Error fetching mentorship progress:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship resources for a relationship
  const getMentorshipResources = async (mentorshipId: string) => {
    if (!user) {
      setError(new Error('You must be logged in to view resources'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mentorship_resources')
        .select(`
          *,
          added_by_profile:added_by(profiles:id(full_name))
        `)
        .eq('mentorship_id', mentorshipId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching resources'));
      console.error('Error fetching mentorship resources:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get mentorship requests (sent or received)
  const getMentorshipRequests = async (isMentor: boolean = false) => {
    if (!user) {
      setError(new Error('You must be logged in to view requests'));
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const column = isMentor ? 'mentor_id' : 'requester_id';
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          requester:requester_id(profiles:id(full_name, avatar_url)),
          mentor:mentor_id(profiles:id(full_name, avatar_url))
        `)
        .eq(column, user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching requests'));
      console.error('Error fetching mentorship requests:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMentors,
    sendMentorshipRequest,
    respondToMentorshipRequest,
    getMentorshipRelationships,
    scheduleMentorshipSession,
    updateSessionFeedback,
    addProgressMilestone,
    updateProgressStatus,
    addMentorshipResource,
    updateResourceStatus,
    getMentorshipSessions,
    getMentorshipProgress,
    getMentorshipResources,
    getMentorshipRequests,
  };
}
