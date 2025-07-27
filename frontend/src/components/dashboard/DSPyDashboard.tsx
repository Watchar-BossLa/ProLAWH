import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDSPy } from "@/hooks/dspy/useDSPy";
import { AlertTriangle, TrendingUp, Zap, Clock } from "lucide-react";

export function DSPyDashboard() {
  const { 
    monitoringMetrics, 
    alerts, 
    optimizeModule, 
    optimizeAllModules,
    isOptimizing,
    resolveAlert 
  } = useDSPy();

  const handleOptimizeAll = async () => {
    try {
      await optimizeAllModules({ method: 'mipro', parallel: false });
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">DSPy Performance Dashboard</h2>
        <Button 
          onClick={handleOptimizeAll} 
          disabled={isOptimizing}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {isOptimizing ? 'Optimizing...' : 'Optimize All Modules'}
        </Button>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                      <span className="font-medium">{alert.module_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitoringMetrics.map((metric) => (
          <Card key={metric.module_name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{metric.module_name.replace('_', ' ')}</span>
                <Badge variant={metric.performance_trend === 'improving' ? 'default' : 
                              metric.performance_trend === 'declining' ? 'destructive' : 'secondary'}>
                  {metric.performance_trend === 'improving' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {metric.performance_trend}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{metric.avg_latency_ms.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Avg Latency</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{(metric.avg_quality_score * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{(metric.success_rate * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{metric.total_calls}</div>
                    <div className="text-sm text-muted-foreground">Total Calls</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {metric.last_optimization ? 
                      `Optimized ${Math.round((Date.now() - metric.last_optimization.getTime()) / (1000 * 60 * 60 * 24))}d ago` :
                      'Never optimized'
                    }
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => optimizeModule(metric.module_name as any)}
                    disabled={isOptimizing}
                  >
                    Optimize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}