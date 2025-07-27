
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSkillGapData } from "@/hooks/useSkillGapData";
import { useCareerTwin } from "@/hooks/useCareerTwin";

export function useCareerVisualization() {
  const { user } = useAuth();
  const { recommendations } = useCareerTwin();
  const skillGapData = useSkillGapData();
  
  const { data: careerVisData, isLoading } = useQuery({
    queryKey: ["career-visualization", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // In a real app, this would be a call to an API or directly to Supabase
      // For now, we can simulate this with the data we already have
      
      // Example structure of what the API might return
      const mockVisualizationData = {
        skillClusters: [
          {
            name: "Frontend Development",
            skills: skillGapData
              .filter(skill => ["React", "JavaScript", "CSS", "HTML", "TypeScript"].includes(skill.subject))
              .map(skill => ({
                name: skill.subject,
                level: skill.userLevel,
                demand: skill.marketDemand
              }))
          },
          {
            name: "Backend Development",
            skills: skillGapData
              .filter(skill => ["Node.js", "Python", "Databases", "API Design"].includes(skill.subject))
              .map(skill => ({
                name: skill.subject,
                level: skill.userLevel,
                demand: skill.marketDemand
              }))
          },
          {
            name: "DevOps",
            skills: skillGapData
              .filter(skill => ["Docker", "Kubernetes", "CI/CD", "Cloud Services"].includes(skill.subject))
              .map(skill => ({
                name: skill.subject,
                level: skill.userLevel,
                demand: skill.marketDemand
              }))
          }
        ],
        careerTrajectory: {
          current: "Mid-level Developer",
          potential: ["Senior Developer", "Team Lead", "Engineering Manager", "CTO"],
          timeEstimates: {
            "Senior Developer": "1-2 years",
            "Team Lead": "2-3 years",
            "Engineering Manager": "4-5 years",
            "CTO": "8+ years"
          }
        },
        marketInsights: {
          hotSkills: ["Machine Learning", "React", "Cloud Architecture", "Data Engineering"],
          salaryData: {
            current: "$85,000",
            potential: "$120,000",
            withRecommendedSkills: "$150,000"
          },
          demandTrends: [
            { skill: "React", trend: "stable", growthRate: 5 },
            { skill: "Machine Learning", trend: "growing", growthRate: 15 },
            { skill: "Docker", trend: "stable", growthRate: 8 },
            { skill: "Python", trend: "growing", growthRate: 12 }
          ]
        }
      };
      
      return mockVisualizationData;
    },
    enabled: !!user && skillGapData.length > 0
  });
  
  // Process skill gap data to get insights
  const skillInsights = useMemo(() => {
    if (!skillGapData.length) return null;
    
    const totalGap = skillGapData.reduce((sum, skill) => {
      return sum + Math.max(0, skill.marketDemand - skill.userLevel);
    }, 0);
    
    const avgGap = totalGap / skillGapData.length;
    const skillsToImprove = skillGapData
      .filter(skill => skill.marketDemand > skill.userLevel)
      .sort((a, b) => (b.marketDemand - b.userLevel) - (a.marketDemand - a.userLevel))
      .slice(0, 5);
    
    const topStrengths = skillGapData
      .filter(skill => skill.userLevel >= skill.marketDemand)
      .sort((a, b) => b.userLevel - a.userLevel)
      .slice(0, 5);
    
    return {
      avgGap,
      totalGap,
      skillsToImprove,
      topStrengths,
      skillCount: skillGapData.length
    };
  }, [skillGapData]);
  
  // Process recommendations to get career insights
  const careerInsights = useMemo(() => {
    if (!recommendations?.length) return null;
    
    const acceptedCount = recommendations.filter(r => r.status === "accepted" || r.status === "implemented").length;
    const implementedCount = recommendations.filter(r => r.status === "implemented").length;
    const pendingCount = recommendations.filter(r => r.status === "pending").length;
    
    const recentRecommendations = recommendations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
    
    return {
      totalCount: recommendations.length,
      acceptedCount,
      implementedCount,
      pendingCount,
      actionRate: recommendations.length ? (acceptedCount / recommendations.length) * 100 : 0,
      implementationRate: acceptedCount ? (implementedCount / acceptedCount) * 100 : 0,
      recentRecommendations
    };
  }, [recommendations]);

  return {
    careerVisData,
    skillInsights,
    careerInsights,
    isLoading
  };
}
