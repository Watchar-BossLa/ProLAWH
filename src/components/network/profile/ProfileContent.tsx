
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkConnection } from "@/types/network";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { RecentActivity } from "./RecentActivity";

interface ProfileContentProps {
  connection: NetworkConnection;
}

export function ProfileContent({ connection }: ProfileContentProps) {
  const experiences = [
    {
      role: connection.role,
      company: connection.company,
      period: "2022 - Present",
      isActive: true
    },
    {
      role: "Lead Developer",
      company: "Previous Company",
      period: "2018 - 2022"
    },
    {
      role: "Senior Developer",
      company: "First Tech Company",
      period: "2015 - 2018"
    }
  ];

  const recentActivities = [
    {
      content: "Shared a resource on React Server Components",
      timestamp: "2 days ago"
    },
    {
      content: "Earned a new badge in System Architecture",
      timestamp: "1 week ago"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Profile</CardTitle>
        <CardDescription>
          {connection.name}'s career information and expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Career Path</h3>
            <p className="text-sm text-muted-foreground">
              {connection.careerPath || "Software Engineering"}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <ExperienceTimeline experiences={experiences} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Master's in Computer Science</h4>
                <p className="text-sm">University of Technology</p>
                <p className="text-xs text-muted-foreground">2013 - 2015</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
