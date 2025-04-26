import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { pageTransitions } from "@/lib/transitions";
import { Briefcase, Filter, Leaf, Search, Shield } from "lucide-react";
import type { Opportunity } from "@/types/marketplace";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  rate_range: string;
  skills_required: string[];
  is_remote: boolean;
  has_insurance: boolean;
  green_score: number;
  created_at: string;
}

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
  },
  // Add more mock data as needed
];

export default function OpportunityMarketplace() {
  const [filter, setFilter] = useState({
    query: "",
    remote: false,
    insured: false,
    minGreenScore: 0,
    skillFilter: [] as string[]
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

  const commonSkills = [
    "Python", "React", "Machine Learning", "Data Analysis", 
    "UI/UX", "Project Management", "Content Creation"
  ];

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
        <Card className="lg:col-span-1 glass-card hover-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search opportunities..." 
                  className="pl-8" 
                  value={filter.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="remote">Remote Only</Label>
                <Switch 
                  id="remote" 
                  checked={filter.remote}
                  onCheckedChange={(checked) => updateFilter('remote', checked)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="insured" className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Insured Gigs
                </Label>
                <Switch 
                  id="insured"
                  checked={filter.insured}
                  onCheckedChange={(checked) => updateFilter('insured', checked)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-green-500" />
                  Green Score (Min {filter.minGreenScore})
                </Label>
              </div>
              <Slider 
                defaultValue={[0]} 
                max={100} 
                step={10}
                value={[filter.minGreenScore]}
                onValueChange={(value) => updateFilter('minGreenScore', value[0])}
                className="my-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tags className="h-4 w-4" />
                Skills
              </Label>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant={filter.skillFilter.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (filter.skillFilter.includes(skill)) {
                        updateFilter('skillFilter', filter.skillFilter.filter(s => s !== skill));
                      } else {
                        updateFilter('skillFilter', [...filter.skillFilter, skill]);
                      }
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Opportunities</TabsTrigger>
              <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : opportunities && opportunities.length > 0 ? (
                  opportunities.map(opportunity => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No opportunities found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to see more results.
                    </p>
                  </div>
                )}
              </div>
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

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="glass-card hover-card gradient-border">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{opportunity.title}</CardTitle>
            <CardDescription>{opportunity.company}</CardDescription>
          </div>
          {opportunity.has_insurance && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Insured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{opportunity.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {opportunity.skills_required.map(skill => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="font-medium">{opportunity.rate_range}</span>
          {opportunity.is_remote && (
            <Badge variant="outline">Remote</Badge>
          )}
        </div>
        {opportunity.green_score > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Leaf className="h-4 w-4 text-green-500" />
            <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full rounded-full">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${opportunity.green_score}%` }}
              ></div>
            </div>
            <span className="text-xs">{opportunity.green_score}%</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Apply Now</Button>
      </CardFooter>
    </Card>
  );
}
