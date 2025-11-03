export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track custom metrics
  trackMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, value);
    }
  }

  // Track API response times
  async trackApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      this.trackMetric(`api_${name}_success`, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.trackMetric(`api_${name}_error`, endTime - startTime);
      throw error;
    }
  }

  // Track component render times
  trackRender(componentName: string, renderTime: number): void {
    this.trackMetric(`render_${componentName}`, renderTime);
  }

  // Get metric statistics
  getMetricStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  // Export all metrics for reporting
  exportMetrics(): Record<string, any> {
    const report: Record<string, any> = {};
    this.metrics.forEach((values, name) => {
      report[name] = this.getMetricStats(name);
    });
    return report;
  }
}

// React hook for performance tracking
import { useEffect, useRef } from 'react';

export function usePerformanceTracking(componentName: string) {
  const startTime = useRef(performance.now());
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    monitor.trackRender(componentName, renderTime);
  }, [componentName, monitor]);

  return {
    trackCustomMetric: (name: string, value: number) => monitor.trackMetric(name, value),
    trackApiCall: <T>(name: string, apiCall: () => Promise<T>) => monitor.trackApiCall(name, apiCall)
  };
}