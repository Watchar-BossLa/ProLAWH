
import { AlertCircle, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChallengeHeaderProps {
  title: string;
  description: string | null;
  timeLimit: number;
  instructions: string;
}

export function ChallengeHeader({
  title,
  description,
  timeLimit,
  instructions
}: ChallengeHeaderProps) {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);

  return (
    <div className="space-y-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <Collapsible open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen} className="w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <h3 className="text-sm font-semibold">Challenge Instructions</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isInstructionsOpen ? "Hide" : "Show"} Instructions
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <p className="text-sm">{instructions}</p>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You have <strong>{Math.floor(timeLimit / 60)}:{(timeLimit % 60).toString().padStart(2, '0')}</strong> to complete this challenge.
        </AlertDescription>
      </Alert>
    </div>
  );
}
