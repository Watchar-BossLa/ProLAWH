
import { ExternalLink, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pageTransitions } from "@/lib/transitions";

export default function StudyBeePage() {
  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Study Bee</h1>
          <p className="text-muted-foreground">Your personal study companion</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Study Bee</CardTitle>
          <CardDescription>
            Continue to your personalized learning environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a 
              href="https://studybee.info" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Launch Study Bee
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
