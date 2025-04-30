
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BiasMetrics {
  equalOpportunity: number;
  demographicParity: number;
  biasScore: number;
}

interface BiasShieldProps {
  metrics?: BiasMetrics;
  isProtected?: boolean;
  isActive?: boolean;
}

export function BiasShield({ 
  metrics = { 
    equalOpportunity: 0.95,
    demographicParity: 0.92,
    biasScore: 0.04
  }, 
  isProtected = true,
  isActive = true
}: BiasShieldProps) {
  
  // Threshold for bias detection (based on blueprint spec)
  const BIAS_THRESHOLD = 0.05;
  const hasBias = metrics.biasScore > BIAS_THRESHOLD;
  
  if (!isActive) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`h-5 w-5 ${isProtected ? 'text-green-500' : 'text-amber-500'}`} />
          <h3 className="text-sm font-medium">Bias-Shield Match Analysis</h3>
        </div>
        <Badge variant={hasBias ? "destructive" : "success"}>
          {hasBias ? "Issues Detected" : "Fair Matching"}
        </Badge>
      </div>
      
      {hasBias && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bias Detected</AlertTitle>
          <AlertDescription>
            Our Bias-Shield has detected potential matching bias above the allowed threshold.
            This match request may be denied for fairness reasons.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Equal Opportunity</span>
          <span className="font-mono">{(metrics.equalOpportunity * 100).toFixed(1)}%</span>
        </div>
        <Progress value={metrics.equalOpportunity * 100} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span>Demographic Parity</span>
          <span className="font-mono">{(metrics.demographicParity * 100).toFixed(1)}%</span>
        </div>
        <Progress value={metrics.demographicParity * 100} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span>Bias Score</span>
          <span className={`font-mono ${hasBias ? 'text-destructive' : 'text-green-500'}`}>
            {(metrics.biasScore * 100).toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={metrics.biasScore * 100} 
          className={`h-2 ${hasBias ? 'bg-destructive/30 [&>div]:bg-destructive' : 'bg-green-100 [&>div]:bg-green-500'}`} 
        />
      </div>
    </div>
  );
}
