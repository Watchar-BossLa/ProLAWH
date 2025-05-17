
import { Button } from "@/components/ui/button";

interface ReadyStateProps {
  onStart: () => void;
}

export function ReadyState({ onStart }: ReadyStateProps) {
  return (
    <div className="flex justify-center pt-4">
      <Button onClick={onStart} size="lg">
        Start Challenge
      </Button>
    </div>
  );
}
