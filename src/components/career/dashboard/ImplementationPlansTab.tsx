
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ImplementationPlansTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Plans</CardTitle>
        <CardDescription>
          Track and manage your career development action plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Implementation plans feature coming soon. Create implementation plans from your recommendations.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
