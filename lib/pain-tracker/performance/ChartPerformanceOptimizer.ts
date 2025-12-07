// ChartPerformanceOptimizer - Implements chart performance optimizations for large datasets
// Provides data sampling, virtualization, and rendering optimizations

import {
  TrendPoint,
  ChartOptimizationOptions,
  ChartPerformanceMetrics,
  PainTrackerError,
} from "../../../types/pain-tracker";

type ChartDataPoint = Record<string, unknown> & { painLevel?: number };

export interface ChartPerformanceOptimizerInterface {
  optimizeDataForChart(
    data: ChartDataPoint[],
    chartType: string,
    options?: ChartOptimizationOptions,
  ): Promise<ChartDataPoint[]>;
  sampleLargeDataset(
    data: ChartDataPoint[],
    maxPoints: number,
    method?: "uniform" | "adaptive" | "importance",
  ): ChartDataPoint[];
  createDataBuckets(data: TrendPoint[], bucketSize: number): TrendPoint[];
  optimizeChartOptions(
    baseOptions: Record<string, unknown>,
    dataSize: number,
  ): Record<string, unknown>;
  measureChartPerformance(renderFunction: () => void): ChartPerformanceMetrics;
  shouldUseVirtualization(dataSize: number, chartType: string): boolean;
}

export class ChartPerformanceOptimizer
  implements ChartPerformanceOptimizerInterface
{
  private performanceThresholds = {
    small: 50,
    medium: 200,
    large: 1000,
    xlarge: 5000,
  };

  private optimizationSettings = {
    maxPointsForSmooth: 200,
    maxPointsForInteractive: 500,
    maxPointsForStatic: 1000,
    bucketSizeThreshold: 100,
    animationDisableThreshold: 500,
    tooltipOptimizeThreshold: 1000,
  };

  /**
   * Optimize data for chart rendering based on size and chart type
   */
  async optimizeDataForChart(
    data: ChartDataPoint[],
    chartType: string,
    options?: ChartOptimizationOptions,
  ): Promise<ChartDataPoint[]> {
    try {
      const dataSize = data.length;
      const opts = {
        maxPoints: this.getMaxPointsForChartType(chartType),
        samplingMethod: "adaptive" as const,
        preserveImportantPoints: true,
        ...options,
      };

      // No optimization needed for small datasets
      if (dataSize <= this.performanceThresholds.small) {
        return data;
      }

      // Apply appropriate optimization strategy
      if (dataSize <= this.performanceThresholds.medium) {
        return this.lightOptimization(data);
      } else if (dataSize <= this.performanceThresholds.large) {
        return this.mediumOptimization(data, chartType, opts);
      } else {
        return this.heavyOptimization(data, chartType, opts);
      }
    } catch (error) {
      throw new PainTrackerError(
        "Failed to optimize chart data",
        "CHART_ERROR",
        error,
      );
    }
  }

  /**
   * Sample large datasets using different methods
   */
  sampleLargeDataset(
    data: ChartDataPoint[],
    maxPoints: number,
    method: "uniform" | "adaptive" | "importance" = "adaptive",
  ): ChartDataPoint[] {
    if (data.length <= maxPoints) {
      return data;
    }

    switch (method) {
      case "uniform":
        return this.uniformSampling(data, maxPoints);
      case "adaptive":
        return this.adaptiveSampling(data, maxPoints);
      case "importance":
        return this.importanceSampling(data, maxPoints);
      default:
        return this.uniformSampling(data, maxPoints);
    }
  }

  /**
   * Create data buckets for aggregation
   */
  createDataBuckets(data: TrendPoint[], bucketSize: number): TrendPoint[] {
    if (data.length <= bucketSize) {
      return data;
    }

    const buckets: TrendPoint[] = [];
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    for (let i = 0; i < sortedData.length; i += bucketSize) {
      const bucket = sortedData.slice(i, i + bucketSize);
      const aggregatedPoint = this.aggregateBucket(bucket);
      buckets.push(aggregatedPoint);
    }

    return buckets;
  }

  /**
   * Optimize chart options based on data size
   */
  optimizeChartOptions(
    baseOptions: Record<string, unknown>,
    dataSize: number,
  ): Record<string, unknown> {
    const optimizedOptions = { ...baseOptions };

    // Disable animations for large datasets
    if (dataSize > this.optimizationSettings.animationDisableThreshold) {
      optimizedOptions.animation = false;
      optimizedOptions.transitions = {
        active: { animation: { duration: 0 } },
        resize: { animation: { duration: 0 } },
      };
    }

    // Optimize tooltips for very large datasets
    if (dataSize > this.optimizationSettings.tooltipOptimizeThreshold) {
      const plugins =
        optimizedOptions.plugins && typeof optimizedOptions.plugins === "object"
          ? optimizedOptions.plugins
          : {};
      const tooltip =
        (plugins as { tooltip?: unknown })?.tooltip &&
        typeof (plugins as { tooltip?: unknown }).tooltip === "object"
          ? (plugins as { tooltip?: unknown }).tooltip
          : {};
      optimizedOptions.plugins = {
        ...(plugins as Record<string, unknown>),
        tooltip: {
          ...(tooltip as Record<string, unknown>),
          enabled: false, // Disable tooltips for performance
          external: this.createOptimizedTooltip, // Use custom lightweight tooltip
        },
      };
    }

    // Optimize scales for large datasets
    if (dataSize > this.performanceThresholds.large) {
      const scales =
        optimizedOptions.scales && typeof optimizedOptions.scales === "object"
          ? optimizedOptions.scales
          : {};
      const xScale =
        (scales as { x?: unknown })?.x &&
        typeof (scales as { x?: unknown }).x === "object"
          ? (scales as { x?: unknown }).x
          : {};
      const xTicks =
        (xScale as { ticks?: unknown })?.ticks &&
        typeof (xScale as { ticks?: unknown }).ticks === "object"
          ? (xScale as { ticks?: unknown }).ticks
          : {};
      const yScale =
        (scales as { y?: unknown })?.y &&
        typeof (scales as { y?: unknown }).y === "object"
          ? (scales as { y?: unknown }).y
          : {};
      const yTicks =
        (yScale as { ticks?: unknown })?.ticks &&
        typeof (yScale as { ticks?: unknown }).ticks === "object"
          ? (yScale as { ticks?: unknown }).ticks
          : {};
      optimizedOptions.scales = {
        ...(scales as Record<string, unknown>),
        x: {
          ...(xScale as Record<string, unknown>),
          ticks: {
            ...(xTicks as Record<string, unknown>),
            maxTicksLimit: 10, // Limit number of x-axis ticks
            autoSkip: true,
            autoSkipPadding: 10,
          },
        },
        y: {
          ...(yScale as Record<string, unknown>),
          ticks: {
            ...(yTicks as Record<string, unknown>),
            maxTicksLimit: 8, // Limit number of y-axis ticks
          },
        },
      };
    }

    // Optimize interaction for large datasets
    if (dataSize > this.performanceThresholds.medium) {
      const interaction =
        optimizedOptions.interaction &&
        typeof optimizedOptions.interaction === "object"
          ? optimizedOptions.interaction
          : {};
      optimizedOptions.interaction = {
        ...(interaction as Record<string, unknown>),
        intersect: false,
        mode: "nearest",
      };
    }

    // Disable point rendering for very large line charts
    if (dataSize > this.performanceThresholds.large) {
      if (
        optimizedOptions.datasets &&
        Array.isArray(optimizedOptions.datasets)
      ) {
        optimizedOptions.datasets = (
          optimizedOptions.datasets as Record<string, unknown>[]
        ).map((dataset: Record<string, unknown>) => ({
          ...dataset,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointHitRadius: 5,
        }));
      }
    }

    return optimizedOptions;
  }

  /**
   * Measure chart rendering performance
   */
  measureChartPerformance(renderFunction: () => void): ChartPerformanceMetrics {
    const startTime = performance.now();
    const startMemory =
      (performance as Performance & { memory?: { usedJSHeapSize?: number } })
        .memory?.usedJSHeapSize || 0;

    renderFunction();

    const endTime = performance.now();
    const endMemory =
      (performance as Performance & { memory?: { usedJSHeapSize?: number } })
        .memory?.usedJSHeapSize || 0;

    return {
      renderTime: endTime - startTime,
      memoryUsed: endMemory - startMemory,
      timestamp: new Date(),
    };
  }

  /**
   * Determine if virtualization should be used
   */
  shouldUseVirtualization(dataSize: number, chartType: string): boolean {
    const thresholds = {
      line: this.performanceThresholds.large,
      bar: this.performanceThresholds.medium,
      scatter: this.performanceThresholds.medium,
      pie: this.performanceThresholds.small,
      doughnut: this.performanceThresholds.small,
    };

    const threshold =
      thresholds[chartType as keyof typeof thresholds] ||
      this.performanceThresholds.medium;
    return dataSize > threshold;
  }

  /**
   * Get progressive loading strategy for large datasets
   */
  getProgressiveLoadingStrategy(dataSize: number): {
    initialLoad: number;
    batchSize: number;
    loadDelay: number;
  } {
    if (dataSize <= this.performanceThresholds.medium) {
      return { initialLoad: dataSize, batchSize: 0, loadDelay: 0 };
    }

    if (dataSize <= this.performanceThresholds.large) {
      return { initialLoad: 100, batchSize: 50, loadDelay: 100 };
    }

    return { initialLoad: 50, batchSize: 25, loadDelay: 50 };
  }

  // Private optimization methods

  private getMaxPointsForChartType(chartType: string): number {
    const limits = {
      line: this.optimizationSettings.maxPointsForSmooth,
      bar: this.optimizationSettings.maxPointsForInteractive,
      scatter: this.optimizationSettings.maxPointsForInteractive,
      pie: 20,
      doughnut: 20,
      radar: 10,
    };

    return (
      limits[chartType as keyof typeof limits] ||
      this.optimizationSettings.maxPointsForStatic
    );
  }

  private lightOptimization(data: ChartDataPoint[]): ChartDataPoint[] {
    // For medium datasets, just remove unnecessary properties
    return data.map((point) => this.cleanDataPoint(point));
  }

  private mediumOptimization(
    data: ChartDataPoint[],
    chartType: string,
    options: ChartOptimizationOptions,
  ): ChartDataPoint[] {
    // Apply sampling if needed
    const maxPoints =
      options.maxPoints || this.getMaxPointsForChartType(chartType);
    let optimizedData = data;

    if (data.length > maxPoints) {
      optimizedData = this.sampleLargeDataset(
        data,
        maxPoints,
        options.samplingMethod,
      );
    }

    return optimizedData.map((point) => this.cleanDataPoint(point));
  }

  private heavyOptimization(
    data: ChartDataPoint[],
    chartType: string,
    options: ChartOptimizationOptions,
  ): ChartDataPoint[] {
    const maxPoints =
      options.maxPoints || this.getMaxPointsForChartType(chartType);

    // First, create buckets for aggregation
    if (
      chartType === "line" &&
      data.length > this.performanceThresholds.xlarge
    ) {
      const bucketSize = Math.ceil(data.length / maxPoints);
      const bucketedData = this.createDataBuckets(
        data as unknown as TrendPoint[],
        bucketSize,
      );
      data = bucketedData as unknown as ChartDataPoint[];
    }

    // Then apply sampling
    let optimizedData = this.sampleLargeDataset(
      data,
      maxPoints,
      options.samplingMethod,
    );

    // Clean and optimize data points
    optimizedData = optimizedData.map((point) => this.cleanDataPoint(point));

    return optimizedData;
  }

  private uniformSampling(
    data: ChartDataPoint[],
    maxPoints: number,
  ): ChartDataPoint[] {
    const step = Math.ceil(data.length / maxPoints);
    const sampled: ChartDataPoint[] = [];

    for (let i = 0; i < data.length; i += step) {
      sampled.push(data[i]);
    }

    // Always include the last point
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1]);
    }

    return sampled;
  }

  private adaptiveSampling(
    data: ChartDataPoint[],
    maxPoints: number,
  ): ChartDataPoint[] {
    if (data.length <= maxPoints) return data;

    const sampled: ChartDataPoint[] = [];
    const step = data.length / maxPoints;

    // Always include first point
    sampled.push(data[0]);

    // Adaptive sampling based on data variance
    for (let i = 1; i < maxPoints - 1; i++) {
      const index = Math.floor(i * step);
      const point = data[index];

      // Include points with high variance from neighbors
      if (this.shouldIncludePoint(data, index)) {
        sampled.push(point);
      } else {
        // Use the point at the calculated index
        sampled.push(data[index]);
      }
    }

    // Always include last point
    sampled.push(data[data.length - 1]);

    return sampled;
  }

  private importanceSampling(
    data: ChartDataPoint[],
    maxPoints: number,
  ): ChartDataPoint[] {
    if (data.length <= maxPoints) return data;

    // Calculate importance scores for each point
    const scoredData = data.map((point, index) => ({
      point,
      index,
      importance: this.calculateImportanceScore(data, index),
    }));

    // Sort by importance and take top points
    scoredData.sort((a, b) => b.importance - a.importance);
    const importantPoints = scoredData.slice(0, maxPoints);

    // Sort back by original index to maintain order
    importantPoints.sort((a, b) => a.index - b.index);

    return importantPoints.map((item) => item.point);
  }

  private shouldIncludePoint(data: ChartDataPoint[], index: number): boolean {
    if (index === 0 || index === data.length - 1) return true;

    const current = data[index];
    const prev = data[index - 1];
    const next = data[index + 1];

    // Include points with significant pain level changes
    if (
      typeof current.painLevel === "number" &&
      typeof prev.painLevel === "number" &&
      typeof next.painLevel === "number"
    ) {
      const prevDiff = Math.abs(current.painLevel - prev.painLevel);
      const nextDiff = Math.abs(next.painLevel - current.painLevel);
      return prevDiff > 1 || nextDiff > 1;
    }

    return false;
  }

  private calculateImportanceScore(
    data: ChartDataPoint[],
    index: number,
  ): number {
    let score = 0;

    const point = data[index];

    // Higher score for extreme pain levels
    if (typeof point.painLevel === "number") {
      if (point.painLevel >= 8 || point.painLevel <= 2) {
        score += 3;
      } else if (point.painLevel >= 6 || point.painLevel <= 4) {
        score += 1;
      }
    }

    // Higher score for points with significant changes
    if (index > 0 && index < data.length - 1) {
      const prev = data[index - 1];
      const next = data[index + 1];

      if (
        typeof point.painLevel === "number" &&
        typeof prev.painLevel === "number" &&
        typeof next.painLevel === "number"
      ) {
        const change =
          Math.abs(point.painLevel - prev.painLevel) +
          Math.abs(next.painLevel - point.painLevel);
        score += change;
      }
    }

    // Higher score for first and last points
    if (index === 0 || index === data.length - 1) {
      score += 5;
    }

    return score;
  }

  private aggregateBucket(bucket: TrendPoint[]): TrendPoint {
    if (bucket.length === 1) return bucket[0];

    const avgPainLevel =
      bucket.reduce((sum, point) => sum + point.painLevel, 0) / bucket.length;
    const middleIndex = Math.floor(bucket.length / 2);
    const representativePoint = bucket[middleIndex];

    return {
      ...representativePoint,
      painLevel: Math.round(avgPainLevel * 10) / 10,
      // Add metadata about aggregation
      _aggregated: true,
      _originalCount: bucket.length,
    } as TrendPoint & { _aggregated: boolean; _originalCount: number };
  }

  private cleanDataPoint(point: ChartDataPoint): ChartDataPoint {
    // Remove unnecessary properties to reduce memory usage
    const cleaned: ChartDataPoint = { ...point };

    // Remove internal properties
    delete cleaned._id;
    delete cleaned.__v;
    delete cleaned.metadata;

    // Round numeric values to reduce precision
    if (typeof cleaned.painLevel === "number") {
      cleaned.painLevel = Math.round(cleaned.painLevel * 10) / 10;
    }

    return cleaned;
  }

  private createOptimizedTooltip(context: {
    tooltip: {
      opacity: number;
      dataPoints: Array<{ parsed: { y: number } }>;
      caretX: number;
      caretY: number;
    };
    chart: { canvas: { offsetLeft: number; offsetTop: number } };
  }): void {
    // Lightweight tooltip implementation for large datasets
    const tooltipEl = document.getElementById("chartjs-tooltip");
    if (!tooltipEl) return;

    const tooltip = context.tooltip;
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = "0";
      return;
    }

    // Simple tooltip content
    const dataPoint = tooltip.dataPoints[0];
    tooltipEl.innerHTML = `
      <div style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
        Pain Level: ${dataPoint.parsed.y}/10
      </div>
    `;

    tooltipEl.style.opacity = "1";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left =
      context.chart.canvas.offsetLeft + tooltip.caretX + "px";
    tooltipEl.style.top =
      context.chart.canvas.offsetTop + tooltip.caretY + "px";
    tooltipEl.style.pointerEvents = "none";
  }
}

export default ChartPerformanceOptimizer;
