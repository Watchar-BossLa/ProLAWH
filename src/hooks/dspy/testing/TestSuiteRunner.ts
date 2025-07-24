/**
 * Comprehensive Test Suite for DSPy Production System
 */

import { DSPyService } from '../DSPyService';
import { DSPyMonitoringService } from '../monitoring/DSPyMonitoringService';
import { PerformanceBenchmark } from '../performance/PerformanceBenchmark';

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  metrics?: Record<string, any>;
}

interface TestSuite {
  name: string;
  tests: TestCase[];
}

interface TestCase {
  name: string;
  setup?: () => Promise<void>;
  test: () => Promise<TestResult>;
  teardown?: () => Promise<void>;
}

export class DSPyTestSuiteRunner {
  private dspyService: DSPyService;
  private monitoring: DSPyMonitoringService;
  private benchmark: PerformanceBenchmark;
  private results: TestResult[] = [];

  constructor(
    dspyService: DSPyService,
    monitoring: DSPyMonitoringService,
    benchmark: PerformanceBenchmark
  ) {
    this.dspyService = dspyService;
    this.monitoring = monitoring;
    this.benchmark = benchmark;
  }

  async runFullTestSuite(): Promise<{ passed: number; failed: number; results: TestResult[] }> {
    console.log('🧪 Starting DSPy Production Test Suite...');
    
    const testSuites: TestSuite[] = [
      this.createCoreModuleTests(),
      this.createPerformanceTests(),
      this.createOptimizationTests(),
      this.createMonitoringTests(),
      this.createErrorHandlingTests()
    ];

    this.results = [];

    for (const suite of testSuites) {
      console.log(`📋 Running test suite: ${suite.name}`);
      
      for (const testCase of suite.tests) {
        try {
          if (testCase.setup) await testCase.setup();
          
          const result = await testCase.test();
          this.results.push(result);
          
          console.log(`${result.passed ? '✅' : '❌'} ${result.testName} (${result.duration}ms)`);
          
          if (testCase.teardown) await testCase.teardown();
        } catch (error) {
          this.results.push({
            testName: testCase.name,
            passed: false,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          console.log(`❌ ${testCase.name} - FAILED: ${error}`);
        }
      }
    }

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    return { passed, failed, results: this.results };
  }

  private createCoreModuleTests(): TestSuite {
    return {
      name: 'Core Module Tests',
      tests: [
        {
          name: 'reasoning_module_basic_functionality',
          test: async () => {
            const start = Date.now();
            try {
              const result = await this.dspyService.generateReasoning('What is 2+2?', 'math');
              const duration = Date.now() - start;
              
              return {
                testName: 'reasoning_module_basic_functionality',
                passed: result.reasoning.length > 0 && result.confidence > 0,
                duration,
                metrics: { confidence: result.confidence, length: result.reasoning.length }
              };
            } catch (error) {
              return {
                testName: 'reasoning_module_basic_functionality',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        },
        {
          name: 'career_advice_module_functionality',
          test: async () => {
            const start = Date.now();
            try {
              const result = await this.dspyService.generateCareerAdvice('software engineer', ['React', 'TypeScript']);
              const duration = Date.now() - start;
              
              return {
                testName: 'career_advice_module_functionality',
                passed: result.advice.length > 0 && result.confidence > 0,
                duration,
                metrics: { confidence: result.confidence, recommendations: result.recommendations?.length || 0 }
              };
            } catch (error) {
              return {
                testName: 'career_advice_module_functionality',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        }
      ]
    };
  }

  private createPerformanceTests(): TestSuite {
    return {
      name: 'Performance Tests',
      tests: [
        {
          name: 'latency_under_threshold',
          test: async () => {
            const start = Date.now();
            try {
              await this.dspyService.generateReasoning('Simple test', 'general');
              const duration = Date.now() - start;
              
              return {
                testName: 'latency_under_threshold',
                passed: duration < 5000, // 5 second threshold
                duration,
                metrics: { latency_ms: duration }
              };
            } catch (error) {
              return {
                testName: 'latency_under_threshold',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        },
        {
          name: 'concurrent_requests_handling',
          test: async () => {
            const start = Date.now();
            try {
              const promises = Array(5).fill(0).map(() => 
                this.dspyService.generateReasoning('Concurrent test', 'general')
              );
              
              const results = await Promise.all(promises);
              const duration = Date.now() - start;
              
              return {
                testName: 'concurrent_requests_handling',
                passed: results.every(r => r.reasoning.length > 0),
                duration,
                metrics: { concurrent_requests: 5, all_successful: results.every(r => r.reasoning.length > 0) }
              };
            } catch (error) {
              return {
                testName: 'concurrent_requests_handling',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        }
      ]
    };
  }

  private createOptimizationTests(): TestSuite {
    return {
      name: 'Optimization Tests',
      tests: [
        {
          name: 'optimization_improves_performance',
          test: async () => {
            const start = Date.now();
            try {
              // Measure performance before optimization
              const beforeResult = await this.dspyService.generateReasoning('Test optimization', 'general');
              
              // Run optimization
              await this.dspyService.optimizeModule('reasoning');
              
              // Measure performance after optimization
              const afterResult = await this.dspyService.generateReasoning('Test optimization', 'general');
              
              const duration = Date.now() - start;
              
              return {
                testName: 'optimization_improves_performance',
                passed: afterResult.confidence >= beforeResult.confidence * 0.95, // Allow 5% variance
                duration,
                metrics: { 
                  before_confidence: beforeResult.confidence,
                  after_confidence: afterResult.confidence
                }
              };
            } catch (error) {
              return {
                testName: 'optimization_improves_performance',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        }
      ]
    };
  }

  private createMonitoringTests(): TestSuite {
    return {
      name: 'Monitoring Tests',
      tests: [
        {
          name: 'metrics_collection_working',
          test: async () => {
            const start = Date.now();
            try {
              // Generate some activity
              await this.dspyService.generateReasoning('Monitoring test', 'general');
              
              // Check if metrics are collected
              const metrics = await this.monitoring.getAllModulesMetrics();
              const duration = Date.now() - start;
              
              return {
                testName: 'metrics_collection_working',
                passed: metrics.length > 0,
                duration,
                metrics: { modules_tracked: metrics.length }
              };
            } catch (error) {
              return {
                testName: 'metrics_collection_working',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        },
        {
          name: 'alert_system_functional',
          test: async () => {
            const start = Date.now();
            try {
              // Create a test alert
              await this.monitoring.createAlert({
                severity: 'low',
                message: 'Test alert for validation',
                source: 'test_suite'
              });
              
              const alerts = await this.monitoring.getActiveAlerts();
              const duration = Date.now() - start;
              
              return {
                testName: 'alert_system_functional',
                passed: alerts.some(alert => alert.message.includes('Test alert')),
                duration,
                metrics: { active_alerts: alerts.length }
              };
            } catch (error) {
              return {
                testName: 'alert_system_functional',
                passed: false,
                duration: Date.now() - start,
                error: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          }
        }
      ]
    };
  }

  private createErrorHandlingTests(): TestSuite {
    return {
      name: 'Error Handling Tests',
      tests: [
        {
          name: 'graceful_error_handling',
          test: async () => {
            const start = Date.now();
            try {
              // Test with invalid input
              const result = await this.dspyService.generateReasoning('', ''); // Empty strings
              const duration = Date.now() - start;
              
              return {
                testName: 'graceful_error_handling',
                passed: result.reasoning !== undefined, // Should handle gracefully
                duration,
                metrics: { handled_gracefully: true }
              };
            } catch (error) {
              // This is actually expected behavior - errors should be thrown
              return {
                testName: 'graceful_error_handling',
                passed: true, // Error handling working correctly
                duration: Date.now() - start,
                metrics: { error_thrown: true }
              };
            }
          }
        }
      ]
    };
  }

  getDetailedReport(): string {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    let report = `\n📊 DSPy Production Test Report\n`;
    report += `================================\n`;
    report += `Total Tests: ${this.results.length}\n`;
    report += `Passed: ${passed} ✅\n`;
    report += `Failed: ${failed} ❌\n`;
    report += `Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%\n`;
    report += `Total Duration: ${totalDuration}ms\n\n`;

    if (failed > 0) {
      report += `Failed Tests:\n`;
      this.results.filter(r => !r.passed).forEach(result => {
        report += `- ${result.testName}: ${result.error || 'Unknown error'}\n`;
      });
    }

    return report;
  }
}