
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Start exploring the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is your personal dashboard. Navigate to different sections using the sidebar.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
