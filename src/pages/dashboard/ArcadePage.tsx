import { useState } from "react";
import { useArcadeChallenges } from "@/hooks/useArcadeChallenges";
import { ArcadeIntro } from "@/components/arcade/ArcadeIntro";
import { ArcadeHeader } from "@/components/arcade/ArcadeHeader";
import { ArcadeFilters } from "@/components/arcade/filters/ArcadeFilters";
import { ArcadeErrorAlert } from "@/components/arcade/ArcadeErrorAlert";
import { ChallengeGrid } from "@/components/arcade/ChallengeGrid";
import { pageTransitions } from "@/lib/transitions";
import { useAuth } from "@/hooks/useAuth";
import { Challenge } from "@/types/arcade";

export default function ArcadePage() {
  const { data: challenges, isLoading, error } = useArcadeChallenges();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  // Mock challenges data for testing
  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "Python Data Structures",
      description: "Demonstrate basic Python data structure knowledge",
      difficulty_level: "beginner",
      points: 50,
      time_limit: 60,
      type: "camera",
      instructions: "Show code examples of Python lists, dictionaries, and tuples",
      validation_rules: {
        required_items: ["python", "list", "dictionary"]
      }
    },
    {
      id: "2",
      title: "Kubernetes Architecture",
      description: "Identify key components in Kubernetes architecture",
      difficulty_level: "intermediate",
      points: 100,
      time_limit: 60,
      type: "camera",
      instructions: "Show a diagram or representation of Kubernetes pods, services, and deployments",
      validation_rules: {
        required_items: ["kubernetes", "pod", "service", "deployment"]
      }
    },
    {
      id: "3",
      title: "Rust Memory Safety",
      description: "Explain Rust's ownership and borrowing system",
      difficulty_level: "advanced",
      points: 150,
      time_limit: 60,
      type: "camera",
      instructions: "Show and explain code examples demonstrating ownership, borrowing and lifetimes in Rust",
      validation_rules: {
        required_items: ["rust", "ownership", "borrowing"]
      }
    },
    {
      id: "4",
      title: "Cloud Computing Basics",
      description: "Test your knowledge of cloud computing fundamentals",
      difficulty_level: "beginner",
      points: 75,
      time_limit: 120,
      type: "quiz",
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
      difficulty_level: "intermediate",
      points: 100,
      time_limit: 300,
      type: "code",
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
    return <ArcadeErrorAlert error={error as Error} />;
  }

  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <ArcadeHeader />
      <ArcadeIntro />
      
      <ArcadeFilters 
        filterType={filterType}
        filterDifficulty={filterDifficulty}
        setFilterType={setFilterType}
        setFilterDifficulty={setFilterDifficulty}
      />

      <ChallengeGrid 
        isLoading={isLoading} 
        challenges={filteredChallenges} 
      />
    </div>
  );
}
