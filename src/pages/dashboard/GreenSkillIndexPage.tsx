
import { useState } from "react";
import { useGreenSkillIndex } from "@/hooks/useGreenSkillIndex";
import { GreenSkillFilter } from "@/components/green-skills/GreenSkillFilter";
import { GreenSkillBadge } from "@/components/green-skills/GreenSkillBadge";
import { GreenSkillIndicator } from "@/components/green-skills/GreenSkillIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";
import { pageTransitions } from "@/lib/transitions";

export default function GreenSkillIndexPage() {
  const {
    filteredSkills,
    isLoading,
    error,
    updateFilters,
    getSkillsByCategory
  } = useGreenSkillIndex();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightGreen, setHighlightGreen] = useState(true);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ searchTerm: value });
  };
  
  const handleFilterChange = (filters: {
    minScore: number;
    onlyGreen: boolean;
    enableHighlighting: boolean;
  }) => {
    updateFilters({
      minScore: filters.minScore,
      onlyGreen: filters.onlyGreen
    });
    setHighlightGreen(filters.enableHighlighting);
  };
  
  const skillCategories = getSkillsByCategory();
  const categories = Object.keys(skillCategories);
  
  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <Leaf className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-3xl font-bold">Green-Skill Index</h1>
          <p className="text-muted-foreground">
            Discover and filter skills by their environmental impact
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <GreenSkillFilter onFilterChange={handleFilterChange} />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-40 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-lg font-medium text-center text-red-500">
                  Error loading green skill data
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please try refreshing the page
                </p>
              </CardContent>
            </Card>
          ) : filteredSkills.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-lg font-medium text-center">
                  No skills match your filters
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Try adjusting your filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={categories[0] || "all"}>
              <TabsList className="mb-4">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillCategories[category].map(skill => (
                      <Card 
                        key={skill.id} 
                        className={highlightGreen && skill.co2_score >= 75 ? "border-green-500/50" : ""}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{skill.name}</CardTitle>
                            <GreenSkillIndicator score={skill.co2_score} />
                          </div>
                          <CardDescription>
                            Demand: <Badge variant="outline">{skill.demand_level}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {skill.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {skill.sdg_alignment.map(sdg => (
                              <Badge key={sdg} variant="secondary">SDG {sdg}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
