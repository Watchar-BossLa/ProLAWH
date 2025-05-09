
import { NetworkConnection, NetworkStats } from "@/types/network";

// Mock data - Replace with actual data from your backend
export const mockStats: NetworkStats = {
  totalConnections: 142,
  mentors: 12,
  peers: 89,
  colleagues: 41,
  pendingRequests: 5
};

// Mock user skills
export const mockUserSkills = [
  "React", "TypeScript", "UI/UX Design", "Product Management", 
  "Data Analysis", "Node.js", "Technical Leadership"
];

// Mock industries/sectors for filtering
export const mockIndustries = [
  "Technology", "Finance", "Healthcare", "Education", 
  "Environment", "Marketing", "Design", "Data Science"
];

// Mock connection data for testing
export const mockConnections: NetworkConnection[] = [
  {
    id: "1",
    userId: "user1",
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    connectionType: "mentor",
    connectionStrength: 85,
    lastInteraction: "2025-04-20",
    status: "connected",
    skills: ["React", "TypeScript", "UI/UX", "System Architecture", "Leadership"],
    bio: "Tech lead with 10+ years in frontend development",
    location: "San Francisco, CA",
    onlineStatus: "online",
    unreadMessages: 2,
    industry: "Technology",
    careerPath: "Software Engineering",
    expertise: ["Frontend Development", "Technical Leadership"]
  },
  {
    id: "2",
    userId: "user2",
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "InnovateLab",
    connectionType: "peer",
    connectionStrength: 72,
    lastInteraction: "2025-04-18",
    status: "connected",
    skills: ["Product Strategy", "Market Analysis", "Agile", "Data Analysis"],
    location: "New York, NY",
    industry: "Technology",
    onlineStatus: "away",
    careerPath: "Product Management"
  },
  {
    id: "3",
    userId: "user3",
    name: "Priya Sharma",
    role: "Data Scientist",
    company: "DataWorks",
    connectionType: "colleague",
    connectionStrength: 63,
    lastInteraction: "2025-04-15",
    status: "connected",
    skills: ["Machine Learning", "Python", "Data Visualization", "Statistics"],
    bio: "Turning data into actionable insights",
    industry: "Data Analytics",
    onlineStatus: "offline",
    careerPath: "Data Science"
  },
  {
    id: "4",
    userId: "user4",
    name: "David Wilson",
    role: "UX Designer",
    company: "Creative Solutions",
    connectionType: "peer",
    connectionStrength: 91,
    lastInteraction: "2025-04-21",
    status: "connected",
    skills: ["Figma", "User Research", "UI Design", "Prototyping", "Adobe XD"],
    location: "Austin, TX",
    industry: "Design",
    onlineStatus: "online",
    unreadMessages: 5,
    careerPath: "Design"
  },
  {
    id: "5",
    userId: "user5",
    name: "Elena Rodriguez",
    role: "Backend Engineer",
    company: "ServerStack",
    connectionType: "mentor",
    connectionStrength: 79,
    lastInteraction: "2025-04-17",
    status: "connected",
    skills: ["Node.js", "Database Design", "API Development", "AWS", "Microservices"],
    industry: "Cloud Computing",
    bio: "Building scalable systems for enterprise applications",
    careerPath: "Software Engineering",
    expertise: ["Backend Development", "Cloud Architecture"]
  },
  {
    id: "6",
    userId: "user6",
    name: "James Taylor",
    role: "Marketing Specialist",
    company: "GrowthHackers",
    connectionType: "colleague",
    connectionStrength: 68,
    lastInteraction: "2025-04-16",
    status: "connected",
    skills: ["Content Strategy", "SEO", "Social Media", "Analytics", "Copywriting"],
    location: "Chicago, IL",
    industry: "Marketing",
    onlineStatus: "online",
    careerPath: "Marketing"
  }
];

// Mock connection data for the active chat
export const mockActiveChatConnection: NetworkConnection = {
  id: "1",
  userId: "user1",
  name: "Sarah Chen",
  role: "Senior Developer",
  company: "TechCorp",
  connectionType: "mentor",
  connectionStrength: 85,
  lastInteraction: "2025-04-20",
  status: "connected",
  skills: ["React", "TypeScript", "UI/UX"],
  bio: "Tech lead with 10+ years in frontend development",
  location: "San Francisco, CA",
  onlineStatus: "online",
  industry: "Technology"
};
