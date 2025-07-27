
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { usePolygonWallet } from "@/hooks/usePolygonWallet";

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting, connect } = usePolygonWallet();

  const handleConnect = () => {
    connect();
  };

  if (isConnected && address) {
    return (
      <Button variant="outline" className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting} className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
