
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface CareerInsightCardsProps {
  setActiveTab: (tab: string) => void;
}

export function CareerInsightCards({ setActiveTab }: CareerInsightCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Skill Gap Analysis</CardTitle>
          <CardDescription>
            Identify missing skills for your career advancement
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            Our AI analyzes your current skills against in-demand market requirements, 
            identifying gaps and recommending personalized learning paths.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
            View Analysis
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Job Match Finder</CardTitle>
          <CardDescription>
            Discover green economy roles aligned with your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            Find career opportunities in sustainable industries that match your 
            skills, experience, and personal interests.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
            Explore Matches
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Mentorship Suggestions</CardTitle>
          <CardDescription>
            Connect with experts aligned to your career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            Get recommendations for mentors with expertise in your target sectors,
            helping accelerate your professional development.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab("recommendations")}>
            Find Mentors
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
