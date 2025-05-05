
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, GraduationCap, Award, ArrowDown } from "lucide-react";
import { CampusStats } from "@/types/campus";
import { Skeleton } from "@/components/ui/skeleton";

interface CampusConnectorOverviewProps {
  stats: CampusStats | null;
  isLoading: boolean;
}

export function CampusConnectorOverview({ stats, isLoading }: CampusConnectorOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Universities" 
          icon={<School className="h-8 w-8" />} 
          value={stats?.universities || 0} 
          description="Connected institutions" 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Students" 
          icon={<Users className="h-8 w-8" />} 
          value={stats?.students || 0} 
          description="Total enrolled" 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Courses" 
          icon={<GraduationCap className="h-8 w-8" />} 
          value={stats?.courses || 0} 
          description="Integrated courses" 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Badges" 
          icon={<Award className="h-8 w-8" />} 
          value={stats?.badges || 0} 
          description="Credentials issued" 
          isLoading={isLoading} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campus Connector Overview</CardTitle>
          <CardDescription>
            Connect your ProLawh platform with universities worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <div className="p-2 rounded-full bg-primary/20">
                <School className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">One-Line Installation</h3>
              <p className="text-sm text-muted-foreground">
                Universities can integrate with ProLawh in under 5 minutes using our Helm chart
              </p>
              <pre className="mt-2 bg-muted p-3 rounded-md text-xs font-mono">
                helm install prolawh-campus-connector prolawh/campus-connector -n education
              </pre>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1">
              <div className="p-2 rounded-full bg-primary/20">
                <ArrowDown className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">LTI 1.3 Compatibility</h3>
              <p className="text-sm text-muted-foreground">
                Seamless integration with all major Learning Management Systems including Canvas, Moodle, Blackboard, and more
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1">
              <div className="p-2 rounded-full bg-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Enrolment & Badge Syncing</h3>
              <p className="text-sm text-muted-foreground">
                Automatic synchronization of student enrollments and verifiable credential badges between ProLawh and university LMS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  description: string;
  isLoading: boolean;
}

function StatsCard({ title, icon, value, description, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
