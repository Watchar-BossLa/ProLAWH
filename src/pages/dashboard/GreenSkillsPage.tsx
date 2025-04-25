
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GreenSkillsList } from "@/components/skills/GreenSkillsList";
import { GreenSkillStats } from "@/components/skills/GreenSkillStats";
import { Leaf, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function GreenSkillsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { data: categories } = useQuery({
    queryKey: ['green-skill-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('green_skill_index')
        .select('category')
        .distinct();
      
      if (error) throw error;
      return data?.map(item => item.category) || [];
    }
  });
  
  const handleDownloadReport = () => {
    // This would connect to a backend service in a real implementation
    toast({
      title: "Report Generated",
      description: "Your Green Skills report has been generated and downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-500" />
            Green Skills Index
          </h2>
          <p className="text-muted-foreground">
            Track and develop sustainable skills for the future of work
          </p>
        </div>
        
        <Button onClick={handleDownloadReport} className="gap-2">
          <ArrowUpRight className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Green Skills</CardTitle>
            <Leaf className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <GreenSkillStats />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Trending</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CO₂ Tracking</div>
            <p className="text-xs text-muted-foreground">
              Highest growth rate in job postings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Impact Potential</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.5%</div>
            <p className="text-xs text-muted-foreground">
              Average CO₂ reduction potential
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Filter by Category</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500 to-green-700 p-6 no-underline outline-none focus:shadow-md"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoryFilter(null);
                        }}
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          All Skills
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          View all green skills across categories
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {categories?.map((category) => (
                    <li key={category}>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCategoryFilter(category);
                          }}
                        >
                          <div className="text-sm font-medium leading-none">{category}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Skills specific to {category.toLowerCase()} sustainability
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <p className="text-sm text-muted-foreground">
          {categoryFilter ? `Showing: ${categoryFilter}` : "Showing: All Categories"}
        </p>
      </div>

      <GreenSkillsList categoryFilter={categoryFilter} />
    </div>
  );
}
