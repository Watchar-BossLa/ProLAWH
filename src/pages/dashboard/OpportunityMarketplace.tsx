
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Shield, Brain, Zap } from "lucide-react";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { OpportunityList } from "@/components/marketplace/OpportunityList";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { AIMatchingDashboard } from "@/components/ai/AIMatchingDashboard";
import { SmartOpportunityCard } from "@/components/ai/SmartOpportunityCard";
import { useAIMatching } from "@/hooks/ai/useAIMatching";
import type { Opportunity, FilterState } from "@/types/marketplace";

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Sustainable Supply Chain Analyst",
    description: "Join our team to optimize supply chain sustainability and reduce carbon footprint. You'll work on implementing green logistics solutions and environmental compliance tracking.",
    company: "EcoLogistics Global",
    rate_range: "$75-95/hr",
    skills_required: ["Supply Chain", "Data Analysis", "Environmental Compliance", "Green Logistics"],
    is_remote: true,
    has_insurance: true,
    green_score: 92,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Renewable Energy Project Manager",
    description: "Lead solar and wind farm development projects from inception to completion. Focus on stakeholder management and environmental impact assessments.",
    company: "SunWind Energy",
    rate_range: "$90-120/hr",
    skills_required: ["Project Management", "Renewable Energy", "Environmental Impact Assessment"],
    is_remote: false,
    has_insurance: true,
    green_score: 95,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "ESG Data Scientist",
    description: "Develop and implement machine learning models to analyze environmental, social, and governance data for investment decisions.",
    company: "GreenVest Finance",
    rate_range: "$85-105/hr",
    skills_required: ["Machine Learning", "ESG Analysis", "Python", "Data Visualization"],
    is_remote: true,
    has_insurance: true,
    green_score: 88,
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "Circular Economy Consultant",
    description: "Help businesses transition to circular economy models. Focus on waste reduction, resource optimization, and sustainable business practices.",
    company: "CircularTech Solutions",
    rate_range: "$70-90/hr",
    skills_required: ["Circular Economy", "Sustainability Consulting", "Waste Management"],
    is_remote: true,
    has_insurance: false,
    green_score: 90,
    created_at: new Date().toISOString()
  },
  {
    id: "5",
    title: "Green Building Architect",
    description: "Design sustainable buildings with focus on LEED certification, energy efficiency, and eco-friendly materials.",
    company: "EcoArchitects",
    rate_range: "$95-125/hr",
    skills_required: ["LEED Certification", "Sustainable Architecture", "Energy Modeling"],
    is_remote: false,
    has_insurance: true,
    green_score: 94,
    created_at: new Date().toISOString()
  }
];

const commonSkills = [
  "Data Analysis", "Renewable Energy", "ESG", "Sustainability",
  "Project Management", "Machine Learning", "Environmental Compliance",
  "Green Architecture", "Circular Economy"
];

export default function OpportunityMarketplace() {
  const [filter, setFilter] = useState<FilterState>({
    query: "",
    remote: false,
    insured: false,
    minGreenScore: 0,
    skillFilter: []
  });
  
  const { 
    opportunityMatches, 
    generateMatches, 
    isAnalyzing,
    behaviorProfile 
  } = useAIMatching();
  
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities', filter],
    queryFn: async () => {
      return mockOpportunities.filter(opp => {
        if (filter.remote && !opp.is_remote) return false;
        if (filter.insured && !opp.has_insurance) return false;
        if (filter.minGreenScore > 0 && opp.green_score < filter.minGreenScore) return false;
        if (filter.query && !opp.title.toLowerCase().includes(filter.query.toLowerCase())) return false;
        return true;
      });
    }
  });

  const updateFilter = (key: string, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateAIMatches = () => {
    generateMatches(mockOpportunities);
  };

  // Get AI-matched opportunities
  const getMatchedOpportunities = () => {
    if (!opportunityMatches?.length) return [];
    
    return mockOpportunities
      .filter(opp => opportunityMatches.some(match => match.opportunity_id === opp.id))
      .sort((a, b) => {
        const matchA = opportunityMatches.find(m => m.opportunity_id === a.id);
        const matchB = opportunityMatches.find(m => m.opportunity_id === b.id);
        return (matchB?.match_score || 0) - (matchA?.match_score || 0);
      });
  };

  return (
    <PageWrapper
      title="Green Career Opportunities"
      description="Discover sustainable and impactful projects aligned with your green skills"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <FilterSidebar 
          filter={filter}
          onFilterChange={updateFilter}
          commonSkills={commonSkills}
        />

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Opportunities</TabsTrigger>
                <TabsTrigger value="ai-matched" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Matched ({opportunityMatches?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="ai-dashboard">AI Dashboard</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>
              
              {behaviorProfile && (
                <Button 
                  onClick={handleGenerateAIMatches}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {isAnalyzing ? 'Analyzing...' : 'Generate AI Matches'}
                </Button>
              )}
            </div>
            
            <TabsContent value="all" className="mt-6">
              <OpportunityList opportunities={opportunities} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="ai-matched" className="mt-6">
              <div className="space-y-4">
                {!opportunityMatches?.length ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="h-12 w-12 text-primary/70 mb-4" />
                    <h3 className="text-lg font-semibold">AI Matching Available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">
                      {!behaviorProfile 
                        ? "Complete your AI behavior profile to get personalized opportunity matches."
                        : "Generate your first AI-powered matches to see opportunities tailored to your skills and preferences."
                      }
                    </p>
                    {!behaviorProfile ? (
                      <Button className="mt-6" onClick={() => window.location.hash = '#ai-dashboard'}>
                        Complete AI Profile
                      </Button>
                    ) : (
                      <Button className="mt-6" onClick={handleGenerateAIMatches} disabled={isAnalyzing}>
                        <Brain className="h-4 w-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Generate AI Matches'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getMatchedOpportunities().map(opportunity => {
                      const matchData = opportunityMatches.find(m => m.opportunity_id === opportunity.id);
                      return (
                        <SmartOpportunityCard 
                          key={opportunity.id}
                          opportunity={opportunity}
                          matchData={matchData}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-dashboard" className="mt-6">
              <AIMatchingDashboard />
            </TabsContent>
            
            <TabsContent value="applied">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Applications Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mt-2">
                  You haven't applied to any opportunities yet. Browse the marketplace to find gigs that match your skills.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">ProLawh AI Advantage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Advanced algorithms analyze your behavior, skills, and success patterns for perfect opportunity matches.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Blockchain-verified credentials and peer-reviewed skill assessments ensure authentic talent matching.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Success Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    AI predicts your success rate for each opportunity based on historical data and compatibility analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
