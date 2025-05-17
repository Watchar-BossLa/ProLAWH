
import { Button } from "@/components/ui/button";
import { Gamepad2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReadyStateProps {
  onStart: () => void;
  challengeType?: string;
}

export function ReadyState({ onStart, challengeType = 'default' }: ReadyStateProps) {
  return (
    <div className="space-y-6 pt-4">
      {challengeType === 'ar' && (
        <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">AR Challenge Ready</h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                  This challenge uses Augmented Reality. Please ensure your device supports AR 
                  and grant camera permissions when prompted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col items-center justify-center">
        <Button onClick={onStart} size="lg" className="gap-2">
          {challengeType === 'ar' ? (
            <>
              <Gamepad2 className="h-5 w-5" />
              Start AR Challenge
            </>
          ) : (
            "Start Challenge"
          )}
        </Button>
      </div>
    </div>
  );
}
