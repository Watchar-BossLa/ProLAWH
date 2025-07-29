/**
 * Security Monitoring Service
 */

export class SecurityMonitoringService {
  private logSecurityEvent: (event: any) => void;
  private dataAccessCounts = new Map<string, number>();

  constructor(logger: (event: any) => void) {
    this.logSecurityEvent = logger;
    this.setupPeriodicChecks();
  }

  // Monitor data access patterns for potential exfiltration
  monitorDataAccess(tableName: string, operation: string, recordCount: number): void {
    const key = `${tableName}_${operation}`;
    const currentCount = this.dataAccessCounts.get(key) || 0;
    const newCount = currentCount + recordCount;
    
    this.dataAccessCounts.set(key, newCount);
    
    // Alert on suspicious bulk data access
    if (recordCount > 1000) {
      this.logSecurityEvent({
        type: 'bulk_data_access',
        severity: 'high',
        description: `Large data access detected: ${recordCount} records from ${tableName}`,
        context: this.createSecurityContext(8),
        metadata: {
          tableName,
          operation,
          recordCount,
          totalAccessed: newCount
        }
      });
    }
    
    // Alert on excessive cumulative access
    if (newCount > 5000) {
      this.logSecurityEvent({
        type: 'excessive_data_access',
        severity: 'high',
        description: `Excessive cumulative data access: ${newCount} records from ${tableName}`,
        context: this.createSecurityContext(9),
        metadata: {
          tableName,
          operation,
          totalAccessed: newCount
        }
      });
    }
  }

  // Detect suspicious DOM modifications
  detectDOMTampering(): void {
    // Monitor for script injection
    const scripts = document.querySelectorAll('script');
    const suspiciousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /document\.write/,
      /innerHTML\s*=/,
      /outerHTML\s*=/
    ];
    
    scripts.forEach((script, index) => {
      const scriptContent = script.textContent || script.innerHTML;
      
      suspiciousPatterns.forEach((pattern, patternIndex) => {
        if (pattern.test(scriptContent)) {
          this.logSecurityEvent({
            type: 'dom_tampering',
            severity: 'high',
            description: `Suspicious script pattern detected`,
            context: this.createSecurityContext(8),
            metadata: {
              scriptIndex: index,
              patternIndex,
              pattern: pattern.toString(),
              scriptPreview: scriptContent.substring(0, 100)
            }
          });
        }
      });
    });
  }

  // Setup periodic security checks
  private setupPeriodicChecks(): void {
    // Reset data access counters every hour
    setInterval(() => {
      this.dataAccessCounts.clear();
    }, 3600000);
    
    // Check for memory usage anomalies every 5 minutes
    setInterval(() => {
      this.checkMemoryUsage();
    }, 300000);
  }

  // Check for memory usage anomalies
  private checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
      
      // Alert if memory usage is very high
      if (usedMB > 500) {
        this.logSecurityEvent({
          type: 'high_memory_usage',
          severity: 'medium',
          description: `High memory usage detected: ${usedMB}MB`,
          context: this.createSecurityContext(4),
          metadata: {
            usedMB,
            totalMB,
            percentage: Math.round((usedMB / totalMB) * 100)
          }
        });
      }
    }
  }

  private createSecurityContext(riskScore: number = 2) {
    return {
      timestamp: new Date().toISOString(),
      riskScore,
      flags: []
    };
  }
}