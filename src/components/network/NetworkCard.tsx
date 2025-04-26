
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NetworkConnection } from "@/types/network";
import { UserRound } from "lucide-react";

interface NetworkCardProps {
  connection: NetworkConnection;
}

export function NetworkCard({ connection }: NetworkCardProps) {
  return (
    <Card className="hover-card glass-card">
      <CardHeader className="flex flex-row items-center gap-4">
        {connection.avatar ? (
          <img 
            src={connection.avatar} 
            alt={connection.name}
            className="h-12 w-12 rounded-full object-cover" 
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">{connection.name}</h3>
          <p className="text-sm text-muted-foreground">{connection.role}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="text-sm">
          <span className="font-medium">Company:</span> {connection.company}
        </div>
        <div className="text-sm">
          <span className="font-medium">Connection Type:</span>{" "}
          <span className="capitalize">{connection.connectionType}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${connection.connectionStrength}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
