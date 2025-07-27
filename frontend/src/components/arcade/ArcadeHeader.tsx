
import { Gamepad2 } from "lucide-react";

export function ArcadeHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Gamepad2 className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold">Nano-Challenge Arcade</h1>
        <p className="text-muted-foreground">Complete quick challenges to earn verifiable credentials</p>
      </div>
    </div>
  );
}
