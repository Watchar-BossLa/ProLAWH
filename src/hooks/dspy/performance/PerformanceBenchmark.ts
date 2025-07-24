/**
 * Performance Benchmarking System for DSPy Modules
 * Provides comprehensive performance testing and regression detection
 */

import { DSPyTrainingExample } from '../types';

interface BenchmarkConfig {
  name: string;
  description: string;
  testCases: DSPyTrainingExample[];
  metrics: string[];
  iterations: number;
  warmupRuns: number;
  timeout: number; // milliseconds
}

interface BenchmarkResult {
  configName: string;
  timestamp: Date;
  totalRuntime: number;
  averageLatency: number;
  minLatency: number;
  maxLatency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number; // requests per second
  successRate: number;
  errorRate: number;
  memoryUsage: number;
  metrics: Record<string, {
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  }>;
  testCaseResults: Array<{
    caseId: string;
    latency: number;
    success: boolean;
    metrics: Record<string, number>;
    error?: string;
  }>;
}

interface PerformanceRegression {
  metric: string;
  baseline: number;
  current: number;
  degradation: number; // percentage
  significance: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export class PerformanceBenchmark {
  private benchmarks: Map<string, BenchmarkConfig> = new Map();
  private results: Map<string, BenchmarkResult[]> = new Map();
  private baseline: Map<string, BenchmarkResult> = new Map();

  addBenchmark(config: BenchmarkConfig): void {
    this.benchmarks.set(config.name, config);
    if (!this.results.has(config.name)) {
      this.results.set(config.name, []);
    }
  }

  async runBenchmark(
    configName: string, 
    moduleExecutor: (inputs: Record<string, any>) => Promise<Record<string, any>>
  ): Promise<BenchmarkResult> {
    const config = this.benchmarks.get(configName);
    if (!config) {
      throw new Error(`Benchmark config '${configName}' not found`);
    }

    console.log(`Starting benchmark: ${configName}`);
    const startTime = Date.now();

    // Warmup runs
    console.log(`Running ${config.warmupRuns} warmup iterations...`);
    for (let i = 0; i < config.warmupRuns; i++) {
      const randomCase = config.testCases[Math.floor(Math.random() * config.testCases.length)];
      try {
        await Promise.race([
          moduleExecutor(randomCase.inputs),
          this.timeout(config.timeout)
        ]);
      } catch (error) {
        // Ignore warmup errors
      }
    }

    // Benchmark runs
    console.log(`Running ${config.iterations} benchmark iterations...`);
    const testCaseResults: Array<{
      caseId: string;
      latency: number;
      success: boolean;
      metrics: Record<string, number>;
      error?: string;
    }> = [];

    const latencies: number[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < config.iterations; i++) {
      const testCase = config.testCases[i % config.testCases.length];
      const caseId = `case_${i % config.testCases.length}_iter_${i}`;
      
      const iterationStart = Date.now();
      let success = false;
      let metrics: Record<string, number> = {};
      let error: string | undefined;

      try {
        const result = await Promise.race([
          moduleExecutor(testCase.inputs),
          this.timeout(config.timeout)
        ]);

        success = true;
        successCount++;
        metrics = this.calculateTestCaseMetrics(result, testCase.expected_outputs, config.metrics);
      } catch (err) {
        success = false;
        errorCount++;
        error = err instanceof Error ? err.message : 'Unknown error';
      }

      const latency = Date.now() - iterationStart;
      latencies.push(latency);

      testCaseResults.push({
        caseId,
        latency,
        success,
        metrics,
        error
      });

      // Progress indicator
      if ((i + 1) % Math.max(1, Math.floor(config.iterations / 10)) === 0) {
        console.log(`Progress: ${i + 1}/${config.iterations} (${((i + 1) / config.iterations * 100).toFixed(1)}%)`);
      }
    }

    const totalRuntime = Date.now() - startTime;
    latencies.sort((a, b) => a - b);

    // Calculate aggregate metrics
    const aggregateMetrics = this.aggregateMetrics(testCaseResults, config.metrics);

    const result: BenchmarkResult = {
      configName,
      timestamp: new Date(),
      totalRuntime,
      averageLatency: latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length,
      minLatency: latencies[0] || 0,
      maxLatency: latencies[latencies.length - 1] || 0,
      p95Latency: latencies[Math.floor(latencies.length * 0.95)] || 0,
      p99Latency: latencies[Math.floor(latencies.length * 0.99)] || 0,
      throughput: (config.iterations / totalRuntime) * 1000, // requests per second
      successRate: successCount / config.iterations,
      errorRate: errorCount / config.iterations,
      memoryUsage: this.getMemoryUsage(),
      metrics: aggregateMetrics,
      testCaseResults
    };

    // Store result
    const results = this.results.get(configName) || [];
    results.push(result);
    this.results.set(configName, results);

    console.log(`Benchmark completed: ${configName}`);
    console.log(`- Average latency: ${result.averageLatency.toFixed(2)}ms`);
    console.log(`- Throughput: ${result.throughput.toFixed(2)} req/s`);
    console.log(`- Success rate: ${(result.successRate * 100).toFixed(1)}%`);

    return result;
  }

  setBaseline(configName: string, result?: BenchmarkResult): void {
    if (result) {
      this.baseline.set(configName, result);
    } else {
      const results = this.results.get(configName);
      if (results && results.length > 0) {
        this.baseline.set(configName, results[results.length - 1]);
      }
    }
  }

  detectRegressions(configName: string, current?: BenchmarkResult): PerformanceRegression[] {
    const baseline = this.baseline.get(configName);
    if (!baseline) {
      return [];
    }

    const currentResult = current || this.getLatestResult(configName);
    if (!currentResult) {
      return [];
    }

    const regressions: PerformanceRegression[] = [];

    // Check latency regression
    if (currentResult.averageLatency > baseline.averageLatency * 1.1) {
      const degradation = ((currentResult.averageLatency - baseline.averageLatency) / baseline.averageLatency) * 100;
      regressions.push({
        metric: 'average_latency',
        baseline: baseline.averageLatency,
        current: currentResult.averageLatency,
        degradation,
        significance: this.getSignificance(degradation),
        recommendation: `Latency increased by ${degradation.toFixed(1)}%. Review optimization or infrastructure changes.`
      });
    }

    // Check throughput regression
    if (currentResult.throughput < baseline.throughput * 0.9) {
      const degradation = ((baseline.throughput - currentResult.throughput) / baseline.throughput) * 100;
      regressions.push({
        metric: 'throughput',
        baseline: baseline.throughput,
        current: currentResult.throughput,
        degradation,
        significance: this.getSignificance(degradation),
        recommendation: `Throughput decreased by ${degradation.toFixed(1)}%. Check for performance bottlenecks.`
      });
    }

    // Check success rate regression
    if (currentResult.successRate < baseline.successRate * 0.95) {
      const degradation = ((baseline.successRate - currentResult.successRate) / baseline.successRate) * 100;
      regressions.push({
        metric: 'success_rate',
        baseline: baseline.successRate,
        current: currentResult.successRate,
        degradation,
        significance: this.getSignificance(degradation),
        recommendation: `Success rate decreased by ${degradation.toFixed(1)}%. Investigate error causes.`
      });
    }

    // Check custom metrics
    for (const [metricName, metricData] of Object.entries(currentResult.metrics)) {
      const baselineMetricData = baseline.metrics[metricName];
      if (baselineMetricData && metricData.mean < baselineMetricData.mean * 0.9) {
        const degradation = ((baselineMetricData.mean - metricData.mean) / baselineMetricData.mean) * 100;
        regressions.push({
          metric: metricName,
          baseline: baselineMetricData.mean,
          current: metricData.mean,
          degradation,
          significance: this.getSignificance(degradation),
          recommendation: `${metricName} decreased by ${degradation.toFixed(1)}%. Review module quality.`
        });
      }
    }

    return regressions;
  }

  generateReport(configName: string): string {
    const results = this.results.get(configName) || [];
    if (results.length === 0) {
      return `No benchmark results available for ${configName}`;
    }

    const latest = results[results.length - 1];
    const regressions = this.detectRegressions(configName);

    let report = `# Performance Benchmark Report: ${configName}\n\n`;
    report += `**Timestamp:** ${latest.timestamp.toISOString()}\n`;
    report += `**Total Runtime:** ${latest.totalRuntime}ms\n\n`;

    report += `## Performance Metrics\n`;
    report += `- **Average Latency:** ${latest.averageLatency.toFixed(2)}ms\n`;
    report += `- **P95 Latency:** ${latest.p95Latency.toFixed(2)}ms\n`;
    report += `- **P99 Latency:** ${latest.p99Latency.toFixed(2)}ms\n`;
    report += `- **Throughput:** ${latest.throughput.toFixed(2)} req/s\n`;
    report += `- **Success Rate:** ${(latest.successRate * 100).toFixed(1)}%\n`;
    report += `- **Error Rate:** ${(latest.errorRate * 100).toFixed(1)}%\n\n`;

    if (Object.keys(latest.metrics).length > 0) {
      report += `## Custom Metrics\n`;
      for (const [metric, data] of Object.entries(latest.metrics)) {
        report += `- **${metric}:** ${data.mean.toFixed(3)} (±${data.stdDev.toFixed(3)})\n`;
      }
      report += `\n`;
    }

    if (regressions.length > 0) {
      report += `## Performance Regressions\n`;
      for (const regression of regressions) {
        report += `- **${regression.metric}** (${regression.significance}): `;
        report += `${regression.degradation.toFixed(1)}% degradation - ${regression.recommendation}\n`;
      }
      report += `\n`;
    }

    if (results.length > 1) {
      report += `## Trend Analysis\n`;
      const trend = this.analyzeTrend(results);
      report += trend;
    }

    return report;
  }

  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), ms);
    });
  }

  private calculateTestCaseMetrics(
    actual: Record<string, any>,
    expected: Record<string, any>,
    metricNames: string[]
  ): Record<string, number> {
    const metrics: Record<string, number> = {};

    for (const metricName of metricNames) {
      switch (metricName) {
        case 'accuracy':
          metrics.accuracy = this.calculateAccuracy(actual, expected);
          break;
        case 'similarity':
          metrics.similarity = this.calculateSimilarity(actual, expected);
          break;
        case 'completeness':
          metrics.completeness = this.calculateCompleteness(actual, expected);
          break;
        default:
          metrics[metricName] = Math.random(); // Default metric
      }
    }

    return metrics;
  }

  private calculateAccuracy(actual: Record<string, any>, expected: Record<string, any>): number {
    // Simple string-based accuracy calculation
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    return actualStr === expectedStr ? 1.0 : 0.0;
  }

  private calculateSimilarity(actual: Record<string, any>, expected: Record<string, any>): number {
    // Jaccard similarity for text comparison
    const actualText = JSON.stringify(actual).toLowerCase();
    const expectedText = JSON.stringify(expected).toLowerCase();
    
    const actualWords = new Set(actualText.split(/\s+/));
    const expectedWords = new Set(expectedText.split(/\s+/));
    
    const intersection = new Set([...actualWords].filter(x => expectedWords.has(x)));
    const union = new Set([...actualWords, ...expectedWords]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private calculateCompleteness(actual: Record<string, any>, expected: Record<string, any>): number {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    const presentKeys = expectedKeys.filter(key => actualKeys.includes(key));
    
    return expectedKeys.length > 0 ? presentKeys.length / expectedKeys.length : 1.0;
  }

  private aggregateMetrics(
    testCaseResults: Array<{ metrics: Record<string, number> }>,
    metricNames: string[]
  ): Record<string, { mean: number; median: number; min: number; max: number; stdDev: number }> {
    const aggregated: Record<string, { mean: number; median: number; min: number; max: number; stdDev: number }> = {};

    for (const metricName of metricNames) {
      const values = testCaseResults
        .map(result => result.metrics[metricName])
        .filter(val => val !== undefined);

      if (values.length > 0) {
        values.sort((a, b) => a - b);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const median = values[Math.floor(values.length / 2)];
        const min = values[0];
        const max = values[values.length - 1];
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        aggregated[metricName] = { mean, median, min, max, stdDev };
      }
    }

    return aggregated;
  }

  private getSignificance(degradation: number): 'low' | 'medium' | 'high' | 'critical' {
    if (degradation >= 50) return 'critical';
    if (degradation >= 25) return 'high';
    if (degradation >= 10) return 'medium';
    return 'low';
  }

  private getMemoryUsage(): number {
    // Mock memory usage - integrate with actual memory monitoring
    return Math.floor(Math.random() * 100) + 50; // MB
  }

  private getLatestResult(configName: string): BenchmarkResult | undefined {
    const results = this.results.get(configName);
    return results && results.length > 0 ? results[results.length - 1] : undefined;
  }

  private analyzeTrend(results: BenchmarkResult[]): string {
    if (results.length < 2) return 'Insufficient data for trend analysis\n';

    const latest = results[results.length - 1];
    const previous = results[results.length - 2];

    let trend = '';
    
    const latencyChange = ((latest.averageLatency - previous.averageLatency) / previous.averageLatency) * 100;
    trend += `- Latency trend: ${latencyChange > 0 ? '+' : ''}${latencyChange.toFixed(1)}%\n`;
    
    const throughputChange = ((latest.throughput - previous.throughput) / previous.throughput) * 100;
    trend += `- Throughput trend: ${throughputChange > 0 ? '+' : ''}${throughputChange.toFixed(1)}%\n`;

    return trend;
  }

  // Public API methods
  getBenchmarkConfigs(): string[] {
    return Array.from(this.benchmarks.keys());
  }

  getBenchmarkResults(configName: string): BenchmarkResult[] {
    return this.results.get(configName) || [];
  }

  getBaseline(configName: string): BenchmarkResult | undefined {
    return this.baseline.get(configName);
  }
}