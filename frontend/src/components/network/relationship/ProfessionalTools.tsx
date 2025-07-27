
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { Briefcase, Link, MessageCircle } from "lucide-react";

interface ProfessionalToolsProps {
  connection: NetworkConnection;
}

export function ProfessionalTools({ connection }: ProfessionalToolsProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Professional Projects</CardTitle>
          <CardDescription>
            Find or initiate professional projects with {connection.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <Briefcase className="mr-2 h-4 w-4" />
            Explore Projects
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Industry Insights</CardTitle>
          <CardDescription>
            Share and receive industry knowledge and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Link className="mr-2 h-4 w-4" />
            Share Insights
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Career Opportunities</CardTitle>
          <CardDescription>
            Share and discover career and job opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            View Opportunities
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Professional Networking</CardTitle>
          <CardDescription>
            Expand your network through shared connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Network Expansion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
