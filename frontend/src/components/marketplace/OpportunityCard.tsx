
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Leaf } from "lucide-react";
import type { Opportunity } from "@/types/marketplace";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
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
