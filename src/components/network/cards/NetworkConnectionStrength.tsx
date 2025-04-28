
import { NetworkConnection } from "@/types/network";

interface NetworkConnectionStrengthProps {
  connection: NetworkConnection;
}

export function NetworkConnectionStrength({ connection }: NetworkConnectionStrengthProps) {
  return (
    <div className="mt-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs">Connection Strength</span>
        <span className="text-xs font-medium">{connection.connectionStrength}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${connection.connectionStrength}%` }}
        />
      </div>
    </div>
  );
}
