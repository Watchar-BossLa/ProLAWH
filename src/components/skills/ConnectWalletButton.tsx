
import { Button } from "@/components/ui/button";
import { useVeriSkill } from "@/hooks/useVeriSkill";
import { Loader2, Wallet2, LogOut } from "lucide-react";
import { useState } from "react";

export function ConnectWalletButton() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectWallet, disconnectWallet, walletConnected, walletAddress } = useVeriSkill();

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  if (walletConnected && walletAddress) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
          Connected
        </div>
        <div className="flex items-center space-x-2">
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </code>
          <Button size="sm" variant="ghost" onClick={disconnectWallet}>
            <LogOut className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnectWallet}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet2 className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
