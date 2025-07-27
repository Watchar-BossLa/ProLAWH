
import { useState, useEffect } from "react";
import { MentorCard } from "@/components/mentorship/MentorCard";
import { useMentorship } from "@/hooks/useMentorship";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MentorshipRequestForm } from "@/components/mentorship/MentorshipRequestForm";
import { Loader2, Search } from "lucide-react";

export function MentorFinderSection() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const { getMentors, loading, error } = useMentorship();
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, industry]);

  const loadMentors = async () => {
    const data = await getMentors();
    if (data) {
      setMentors(data);
      setFilteredMentors(data);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mentor => {
        const name = mentor.profiles?.full_name?.toLowerCase() || "";
        const expertiseMatch = mentor.expertise.some((exp: string) => 
          exp.toLowerCase().includes(term)
        );
        return name.includes(term) || expertiseMatch;
      });
    }
    
    // Filter by industry
    if (industry) {
      filtered = filtered.filter(mentor => mentor.industry === industry);
    }
    
    setFilteredMentors(filtered);
  };

  const handleRequestMentorship = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (mentor) {
      setSelectedMentor({
        id: mentor.id,
        name: mentor.profiles?.full_name || "Mentor",
        avatar: mentor.profiles?.avatar_url,
        expertise: mentor.expertise || []
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or expertise..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-40">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          Error loading mentors. Please try again.
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              id={mentor.id}
              name={mentor.profiles?.full_name || "Mentor"}
              avatar={mentor.profiles?.avatar_url}
              role={mentor.profiles?.role}
              company={mentor.profiles?.company}
              expertise={mentor.expertise || []}
              yearsExperience={mentor.years_of_experience}
              isAcceptingMentees={mentor.is_accepting_mentees}
              onRequestMentorship={handleRequestMentorship}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No mentors found matching your criteria.
        </div>
      )}

      {selectedMentor && (
        <MentorshipRequestForm
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          mentor={selectedMentor}
          onSuccess={loadMentors}
        />
      )}
    </div>
  );
}
