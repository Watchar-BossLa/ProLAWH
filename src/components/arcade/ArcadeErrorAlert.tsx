
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ArcadeErrorAlertProps {
  error: Error;
}

export function ArcadeErrorAlert({ error }: ArcadeErrorAlertProps) {
  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertTitle>Error Loading Challenges</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}
