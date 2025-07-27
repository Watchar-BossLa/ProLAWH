
import { NetworkConnection } from "@/types/network";

interface NetworkCardStatusProps {
  connection: NetworkConnection;
}

export function NetworkCardStatus({ connection }: NetworkCardStatusProps) {
  const statusColors = {
    'online': 'bg-green-500',
    'away': 'bg-amber-500',
    'offline': 'bg-gray-400'
  };

  return (
    <>
      {connection.onlineStatus && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusColors[connection.onlineStatus]}`}></div>
          <span className="text-xs text-muted-foreground capitalize">{connection.onlineStatus}</span>
        </div>
      )}
      
      {connection.unreadMessages && connection.unreadMessages > 0 && (
        <div className="absolute top-4 left-4 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
          {connection.unreadMessages}
        </div>
      )}
    </>
  );
}
