
interface WalletPromptProps {
  show: boolean;
}

export function WalletPrompt({ show }: WalletPromptProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
      Connect your wallet to receive a blockchain credential for this achievement!
    </div>
  );
}
