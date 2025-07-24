import { useState, useEffect, useCallback, useRef } from 'react';
import { useLLM } from '../useLLM';
import { DSPyService } from './DSPyService';
import { DSPyOptimizationResult, DSPyTrainingExample } from './types';
import { DSPyMonitoringService } from './monitoring/DSPyMonitoringService';

/**
 * React hook for DSPy integration
 * Provides access to DSPy-optimized AI capabilities
 */
export function useDSPy() {
  const llm = useLLM();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<Record<string, DSPyOptimizationResult>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, any>>({});
  const [monitoringMetrics, setMonitoringMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  
  const dspyServiceRef = useRef<DSPyService | null>(null);
  const monitoringServiceRef = useRef<DSPyMonitoringService | null>(null);

  // Initialize DSPy service
  useEffect(() => {
    if (!dspyServiceRef.current) {
      dspyServiceRef.current = new DSPyService(llm);
      monitoringServiceRef.current = new DSPyMonitoringService();
      setIsInitialized(true);
      
      // Load initial performance metrics
      const metrics = dspyServiceRef.current.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      // Load monitoring metrics and alerts
      loadMonitoringData();
    }
  }, [llm]);

  const loadMonitoringData = useCallback(async () => {
    if (monitoringServiceRef.current) {
      try {
        const [metrics, alertsList] = await Promise.all([
          monitoringServiceRef.current.getAllModulesMetrics(),
          monitoringServiceRef.current.getActiveAlerts()
        ]);
        setMonitoringMetrics(metrics);
        setAlerts(alertsList);
      } catch (error) {
        console.error('Failed to load monitoring data:', error);
      }
    }
  }, []);

  /**
   * Get enhanced reasoning chain using DSPy
   */
  const getEnhancedReasoningChain = useCallback(async (
    agentId: string,
    problem: string,
    context: any,
    agentType: string = 'general'
  ) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    return await dspyServiceRef.current.getEnhancedReasoningChain(
      agentId,
      problem,
      context,
      agentType
    );
  }, []);

  /**
   * Get optimized career advice using DSPy
   */
  const getCareerAdvice = useCallback(async (
    userProfile: any,
    careerGoals: string,
    currentSkills: string[],
    additionalContext?: any
  ) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    return await dspyServiceRef.current.getCareerAdvice(
      userProfile,
      careerGoals,
      currentSkills,
      additionalContext
    );
  }, []);

  /**
   * Get optimized swarm coordination using DSPy
   */
  const getSwarmCoordination = useCallback(async (
    task: string,
    participatingAgents: string[],
    agentCapabilities: Record<string, string[]>,
    coordinationStrategy: 'hierarchical' | 'distributed' | 'consensus' = 'distributed',
    additionalContext?: any
  ) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    return await dspyServiceRef.current.getSwarmCoordination(
      task,
      participatingAgents,
      agentCapabilities,
      coordinationStrategy,
      additionalContext
    );
  }, []);

  /**
   * Optimize a specific DSPy module
   */
  const optimizeModule = useCallback(async (
    moduleName: 'reasoning' | 'career_advice' | 'swarm_intelligence',
    customMetric?: (inputs: Record<string, any>, outputs: Record<string, any>) => number
  ) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    setIsOptimizing(true);
    
    try {
      const result = await dspyServiceRef.current.optimizeModule(moduleName, customMetric);
      
      setOptimizationResults(prev => ({
        ...prev,
        [moduleName]: result
      }));
      
      // Update performance metrics
      const metrics = dspyServiceRef.current.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      return result;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  /**
   * Optimize all DSPy modules
   */
  const optimizeAllModules = useCallback(async (options?: { method?: string; parallel?: boolean }) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    setIsOptimizing(true);
    
    try {
      const results = await dspyServiceRef.current.optimizeAllModules();
      setOptimizationResults(results);
      
      // Update performance metrics
      const metrics = dspyServiceRef.current.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      // Refresh monitoring data
      await loadMonitoringData();
      
      return results;
    } finally {
      setIsOptimizing(false);
    }
  }, [loadMonitoringData]);

  /**
   * Add training example to a module
   */
  const addTrainingExample = useCallback((
    moduleName: 'reasoning' | 'career_advice' | 'swarm_intelligence',
    example: DSPyTrainingExample
  ) => {
    if (!dspyServiceRef.current) {
      throw new Error('DSPy service not initialized');
    }
    
    dspyServiceRef.current.addTrainingExample(moduleName, example);
    
    // Update performance metrics
    const metrics = dspyServiceRef.current.getPerformanceMetrics();
    setPerformanceMetrics(metrics);
  }, []);

  /**
   * Get optimization history for a module
   */
  const getOptimizationHistory = useCallback((moduleName: string): DSPyOptimizationResult[] => {
    if (!dspyServiceRef.current) {
      return [];
    }
    
    return dspyServiceRef.current.getOptimizationHistory(moduleName);
  }, []);

  /**
   * Refresh performance metrics
   */
  const refreshMetrics = useCallback(() => {
    if (dspyServiceRef.current) {
      const metrics = dspyServiceRef.current.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    }
  }, []);

  /**
   * Reset all DSPy modules (useful for testing)
   */
  const resetModules = useCallback(() => {
    if (dspyServiceRef.current) {
      dspyServiceRef.current.reset();
      setOptimizationResults({});
      
      // Update performance metrics
      const metrics = dspyServiceRef.current.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    }
  }, []);

  /**
   * Resolve an alert
   */
  const resolveAlert = useCallback(async (alertId: string) => {
    if (monitoringServiceRef.current) {
      try {
        await monitoringServiceRef.current.resolveAlert(alertId);
        await loadMonitoringData(); // Refresh alerts
      } catch (error) {
        console.error('Failed to resolve alert:', error);
      }
    }
  }, [loadMonitoringData]);

  return {
    // State
    isInitialized,
    isOptimizing,
    optimizationResults,
    performanceMetrics,
    monitoringMetrics,
    alerts,
    
    // Core DSPy functions
    getEnhancedReasoningChain,
    getCareerAdvice,
    getSwarmCoordination,
    
    // Optimization functions
    optimizeModule,
    optimizeAllModules,
    
    // Training and management functions
    addTrainingExample,
    getOptimizationHistory,
    refreshMetrics,
    resetModules,
    
    // Monitoring functions
    resolveAlert,
    loadMonitoringData,
    
    // Utility
    isLLMLoading: llm.isLoading,
    llmError: llm.error
  };
}