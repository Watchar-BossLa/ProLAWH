
import { useEffect, useState } from 'react';
import { useMentorship } from '@/hooks/useMentorship';
import { MentorshipCard } from './MentorshipCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MentorshipListProps {
  filter?: string;
}

export function MentorshipList({ filter = 'all' }: MentorshipListProps) {
  const { getMentorshipRelationships, loading, error } = useMentorship();
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentorships = async () => {
      setIsLoading(true);
      try {
        const data = await getMentorshipRelationships();
        setMentorships(data);
      } catch (err) {
        console.error('Error fetching mentorships:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorships();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Error loading mentorships</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (mentorships.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No mentorships found</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any active mentorship relationships yet.
        </p>
        <Button>Find a Mentor</Button>
      </div>
    );
  }

  // Filter mentorships based on filter prop
  const filteredMentorships = filter === 'all' 
    ? mentorships 
    : mentorships.filter(m => m.status === filter);

  return (
    <div className="space-y-4">
      {filteredMentorships.map((mentorship) => (
        <MentorshipCard key={mentorship.id} mentorship={mentorship} />
      ))}
    </div>
  );
}
