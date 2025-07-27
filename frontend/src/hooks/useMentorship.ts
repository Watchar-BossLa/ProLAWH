
import { useMentorList } from './useMentorList';
import { useMentorshipRequests } from './useMentorshipRequests';
import { useMentorshipRelationship } from './useMentorshipRelationship';
import { useMentorshipSessions } from './useMentorshipSessions';
import { useMentorshipProgress } from './useMentorshipProgress';
import { useMentorshipResources } from './useMentorshipResources';

export function useMentorship() {
  const mentorList = useMentorList();
  const mentorshipRequests = useMentorshipRequests();
  const mentorshipRelationship = useMentorshipRelationship();
  const sessions = useMentorshipSessions();
  const progress = useMentorshipProgress();
  const resources = useMentorshipResources();

  return {
    ...mentorList,
    ...mentorshipRequests,
    ...mentorshipRelationship,
    ...sessions,
    ...progress,
    ...resources,
  };
}

export type {
  MentorProfile,
  MentorshipRequest,
  MentorshipRelationship,
} from './types/mentorship';
