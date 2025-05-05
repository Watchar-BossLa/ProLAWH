
import { useEffect, useState } from "react";
import { useArcadeChallenges } from "@/hooks/useArcadeChallenges";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import { ArcadeIntro } from "@/components/arcade/ArcadeIntro";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Filter } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { pageTransitions } from "@/lib/transitions";
import { useAuth } from "@/hooks/useAuth";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function ArcadePage() {
  const { data: challenges, isLoading, error } = useArcadeChallenges();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  // Mock challenges data for testing
  const mockChallenges = [
    {
      id: "1",
      title: "Python Data Structures",
      description: "Demonstrate basic Python data structure knowledge",
      difficulty_level: "beginner" as const,
      points: 50,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show code examples of Python lists, dictionaries, and tuples",
      validation_rules: {
        required_items: ["python", "list", "dictionary"]
      }
    },
    {
      id: "2",
      title: "Kubernetes Architecture",
      description: "Identify key components in Kubernetes architecture",
      difficulty_level: "intermediate" as const,
      points: 100,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show a diagram or representation of Kubernetes pods, services, and deployments",
      validation_rules: {
        required_items: ["kubernetes", "pod", "service", "deployment"]
      }
    },
    {
      id: "3",
      title: "Rust Memory Safety",
      description: "Explain Rust's ownership and borrowing system",
      difficulty_level: "advanced" as const,
      points: 150,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show and explain code examples demonstrating ownership, borrowing and lifetimes in Rust",
      validation_rules: {
        required_items: ["rust", "ownership", "borrowing"]
      }
    },
    {
      id: "4",
      title: "Cloud Computing Basics",
      description: "Test your knowledge of cloud computing fundamentals",
      difficulty_level: "beginner" as const,
      points: 75,
      time_limit: 120,
      type: "quiz" as const,
      instructions: "Answer questions about basic cloud computing concepts",
      validation_rules: {
        correct_answers: {
          "q1": "Infrastructure as a Service",
          "q2": ["Public Cloud", "Private Cloud", "Hybrid Cloud"],
          "q3": "Amazon Web Services"
        }
      },
      questions: [
        {
          id: "q1",
          text: "What does IaaS stand for?",
          type: "multiple-choice",
          options: [
            "Internet as a Service",
            "Infrastructure as a Service",
            "Intelligence as a Service",
            "Integration as a Service"
          ]
        },
        {
          id: "q2",
          text: "Which of the following are common cloud deployment models?",
          type: "multiple-choice",
          options: [
            "Public Cloud",
            "Private Cloud",
            "Hybrid Cloud",
            "All of the above"
          ]
        },
        {
          id: "q3",
          text: "Which of these is a major cloud provider?",
          type: "multiple-choice",
          options: [
            "Amazon Web Services",
            "Microsoft Excel",
            "Apple iCloud",
            "Facebook Cloud"
          ]
        }
      ]
    },
    {
      id: "5",
      title: "JavaScript Array Challenge",
      description: "Implement array manipulation functions",
      difficulty_level: "intermediate" as const,
      points: 100,
      time_limit: 300,
      type: "code" as const,
      instructions: "Write a function that finds the sum of all numbers in an array",
      validation_rules: {
        test_cases: [
          {
            input: "[1, 2, 3, 4, 5]",
            expected_output: "15",
            description: "Sum of positive integers"
          },
          {
            input: "[-1, -2, 10]",
            expected_output: "7",
            description: "Sum of mixed numbers"
          },
          {
            input: "[]",
            expected_output: "0",
            description: "Empty array should return zero"
          }
        ]
      }
    }
  ];

  const displayChallenges = challenges?.length ? challenges : mockChallenges;
  
  // Apply filters
  const filteredChallenges = displayChallenges.filter(challenge => {
    const typeMatches = filterType === "all" || challenge.type === filterType;
    const difficultyMatches = filterDifficulty === "all" || challenge.difficulty_level === filterDifficulty;
    return typeMatches && difficultyMatches;
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Challenges</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Nano-Challenge Arcade</h1>
          <p className="text-muted-foreground">Complete quick challenges to earn verifiable credentials</p>
        </div>
      </div>

      <ArcadeIntro />
      
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" /> 
          Challenge Filters
        </h2>
        <div className="flex gap-3">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Challenge Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="camera">Camera</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="ar">AR</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filterDifficulty}
            onValueChange={setFilterDifficulty}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Challenges Available</h3>
          <p className="text-muted-foreground">No challenges match your current filters. Try adjusting them or check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-500">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
