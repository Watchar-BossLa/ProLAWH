
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Shield } from "lucide-react";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { OpportunityList } from "@/components/marketplace/OpportunityList";
import { pageTransitions } from "@/lib/transitions";
import type { Opportunity, FilterState } from "@/types/marketplace";

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Senior React Developer",
    description: "Looking for an experienced React developer to join our team...",
    company: "TechCorp",
    rate_range: "$80-120/hr",
    skills_required: ["React", "TypeScript", "Node.js"],
    is_remote: true,
    has_insurance: true,
    green_score: 85,
    created_at: new Date().toISOString()
  }
];

const commonSkills = [
  "Python", "React", "Machine Learning", "Data Analysis", 
  "UI/UX", "Project Management", "Content Creation"
];

export default function OpportunityMarketplace() {
  const [filter, setFilter] = useState<FilterState>({
    query: "",
    remote: false,
    insured: false,
    minGreenScore: 0,
    skillFilter: []
  });
  
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

  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Opportunity Marketplace
          </h1>
          <p className="text-muted-foreground">Find and apply for personalized opportunities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <FilterSidebar 
          filter={filter}
          onFilterChange={updateFilter}
          commonSkills={commonSkills}
        />

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Opportunities</TabsTrigger>
              <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <OpportunityList opportunities={opportunities} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="recommended">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-12 w-12 text-primary/70 mb-4" />
                <h3 className="text-lg font-semibold">Bias-Shield Match Engine</h3>
                <p className="text-muted-foreground max-w-md mx-auto mt-2">
                  Our AI-powered matching engine is analyzing your skills, preferences, and the market to find the perfect opportunities for you.
                </p>
                <Button className="mt-6">Refresh Recommendations</Button>
              </div>
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
            <h3 className="text-lg font-semibold mb-4">ProLawh Advantage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Bias-Shield</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Our matching algorithm ensures fairness by eliminating biases in opportunity recommendations.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Gig Insurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Protected work arrangements with built-in insurance for both clients and freelancers.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skill Staking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Stake your tokens on skills to earn rewards and stand out in the marketplace.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
