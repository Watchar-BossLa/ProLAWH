
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Flag } from "lucide-react";

interface ChallengeCompletionProps {
  result: {
    success: boolean;
    points: number;
    message: string;
  } | null;
  onRetry: () => void;
  onReturn: () => void;
}

export default function ChallengeCompletion({ result, onRetry, onReturn }: ChallengeCompletionProps) {
  if (!result) return null;

  return (
    <div className="text-center py-8 space-y-6">
      {result.success ? (
        <>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mt-4">Challenge Completed!</h2>
            <p className="text-muted-foreground mt-1">{result.message}</p>
          </div>
          
          <div className="bg-muted p-6 rounded-lg max-w-sm mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-lg">Points Earned</span>
              </div>
              <span className="text-2xl font-bold">{result.points}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <Flag className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mt-4">Challenge Failed</h2>
            <p className="text-muted-foreground mt-1">{result.message}</p>
          </div>
        </>
      )}
      
      <div className="flex justify-center gap-4">
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
        <Button onClick={onReturn}>
          Return to Arcade
        </Button>
      </div>
    </div>
  );
}
