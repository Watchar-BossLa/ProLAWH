
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardPlaceholderProps {
  title: string;
  description?: string;
}

const DashboardPlaceholder = ({ 
  title, 
  description = "This feature will be implemented in an upcoming sprint." 
}: DashboardPlaceholderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            ProLawh Learning And Workforce Hub
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPlaceholder;
