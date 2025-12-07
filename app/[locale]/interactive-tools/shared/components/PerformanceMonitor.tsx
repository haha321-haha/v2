"use client";

import { useState, useCallback } from "react";
import { logInfo, logWarn, logError } from "@/lib/debug-logger";

/**
 * P3阶段：性能监控和优化系统
 * 监控应用性能指标，提供优化建议
 */

// 性能指标接口
interface PerformanceMetrics {
  // 加载性能
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;

  // 运行时性能
  memoryUsage: number;
  renderTime: number;
  componentCount: number;

  // 网络性能
  networkRequests: number;
  totalTransferSize: number;

  // 用户体验
  interactionTime: number;
  errorRate: number;
}

// 性能优化建议接口
interface OptimizationSuggestion {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  action: string;
}

// 性能监控钩子
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // 收集性能指标
  const collectMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const metrics: PerformanceMetrics = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      memoryUsage: 0,
      renderTime: 0,
      componentCount: 0,
      networkRequests: 0,
      totalTransferSize: 0,
      interactionTime: 0,
      errorRate: 0,
    };

    // 使用Performance API收集指标
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType("paint");

      // 页面加载时间
      metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;

      // 首次内容绘制
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint",
      );
      if (fcpEntry) {
        metrics.firstContentfulPaint = fcpEntry.startTime;
      }

      // 最大内容绘制
      const lcpEntry = paintEntries.find(
        (entry) => entry.name === "largest-contentful-paint",
      );
      if (lcpEntry) {
        metrics.largestContentfulPaint = lcpEntry.startTime;
      }

      // 内存使用情况
      if ("memory" in performance) {
        const memMetrics = performance as Performance & {
          memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
        };
        const memory = memMetrics.memory;
        if (memory?.jsHeapSizeLimit) {
          metrics.memoryUsage =
            memory.jsHeapSizeLimit > 0
              ? memory.usedJSHeapSize / memory.jsHeapSizeLimit
              : metrics.memoryUsage;
        }
      }

      // 网络请求统计
      const resourceEntries = performance.getEntriesByType("resource");
      metrics.networkRequests = resourceEntries.length;
      metrics.totalTransferSize = resourceEntries.reduce((total, entry) => {
        return total + (entry.transferSize || 0);
      }, 0);
    }

    // 使用Web Vitals API收集Core Web Vitals
    if (typeof window !== "undefined") {
      try {
        // 这里可以集成web-vitals库来获取更准确的指标
        // 暂时使用简化的实现
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              metrics.largestContentfulPaint = entry.startTime;
            }
          }
        });

        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (error) {
        logWarn(
          "Web Vitals monitoring not available",
          error,
          "PerformanceMonitor",
        );
      }
    }

    return metrics;
  }, []);

  // 生成优化建议
  const generateSuggestions = useCallback(
    (metrics: PerformanceMetrics): OptimizationSuggestion[] => {
      const suggestions: OptimizationSuggestion[] = [];

      // 加载时间优化建议
      if (metrics.loadTime > 3000) {
        suggestions.push({
          id: "slow-load-time",
          type: "critical",
          title: "页面加载时间过长",
          description: `当前加载时间为 ${metrics.loadTime.toFixed(
            0,
          )}ms，建议优化到3秒以内`,
          impact: "high",
          effort: "medium",
          action: "实施代码分割和懒加载",
        });
      }

      // 首次内容绘制优化建议
      if (metrics.firstContentfulPaint > 1800) {
        suggestions.push({
          id: "slow-fcp",
          type: "warning",
          title: "首次内容绘制时间过长",
          description: `当前FCP为 ${metrics.firstContentfulPaint.toFixed(
            0,
          )}ms，建议优化到1.8秒以内`,
          impact: "high",
          effort: "medium",
          action: "优化关键渲染路径，减少阻塞资源",
        });
      }

      // 内存使用优化建议
      if (metrics.memoryUsage > 0.8) {
        suggestions.push({
          id: "high-memory-usage",
          type: "warning",
          title: "内存使用率过高",
          description: `当前内存使用率为 ${(metrics.memoryUsage * 100).toFixed(
            1,
          )}%，建议优化内存使用`,
          impact: "medium",
          effort: "high",
          action: "检查内存泄漏，优化组件卸载",
        });
      }

      // 网络请求优化建议
      if (metrics.networkRequests > 50) {
        suggestions.push({
          id: "too-many-requests",
          type: "info",
          title: "网络请求过多",
          description: `当前有 ${metrics.networkRequests} 个网络请求，建议合并请求`,
          impact: "medium",
          effort: "medium",
          action: "实施请求合并和缓存策略",
        });
      }

      // 传输大小优化建议
      if (metrics.totalTransferSize > 1024 * 1024) {
        // 1MB
        suggestions.push({
          id: "large-transfer-size",
          type: "warning",
          title: "传输数据量过大",
          description: `当前传输大小为 ${(
            metrics.totalTransferSize /
            1024 /
            1024
          ).toFixed(2)}MB，建议压缩资源`,
          impact: "medium",
          effort: "low",
          action: "启用Gzip压缩，优化图片和资源",
        });
      }

      return suggestions;
    },
    [],
  );

  // 开始监控
  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);

    try {
      const collectedMetrics = await collectMetrics();
      const optimizationSuggestions = generateSuggestions(collectedMetrics);

      setMetrics(collectedMetrics);
      setSuggestions(optimizationSuggestions);

      logInfo("📊 性能指标收集完成", collectedMetrics, "PerformanceMonitor");
      logInfo("💡 优化建议", optimizationSuggestions, "PerformanceMonitor");
    } catch (error) {
      logError("性能监控失败", error, "PerformanceMonitor");
    } finally {
      setIsMonitoring(false);
    }
  }, [collectMetrics, generateSuggestions]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // 重置指标
  const resetMetrics = useCallback(() => {
    setMetrics(null);
    setSuggestions([]);
  }, []);

  return {
    metrics,
    suggestions,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    collectMetrics,
  };
}

// 性能优化建议组件
export function PerformanceOptimizationPanel() {
  const {
    metrics,
    suggestions,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
  } = usePerformanceMonitoring();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">性能优化面板</h2>
        <div className="flex gap-2">
          <button
            onClick={startMonitoring}
            disabled={isMonitoring}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isMonitoring ? "监控中..." : "开始监控"}
          </button>
          <button
            onClick={stopMonitoring}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            停止监控
          </button>
          <button
            onClick={resetMetrics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            重置
          </button>
        </div>
      </div>

      {metrics && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">性能指标</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">加载时间</div>
              <div className="text-2xl font-bold text-blue-800">
                {metrics.loadTime.toFixed(0)}ms
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">首次内容绘制</div>
              <div className="text-2xl font-bold text-green-800">
                {metrics.firstContentfulPaint.toFixed(0)}ms
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">内存使用率</div>
              <div className="text-2xl font-bold text-purple-800">
                {(metrics.memoryUsage * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600">网络请求</div>
              <div className="text-2xl font-bold text-orange-800">
                {metrics.networkRequests}
              </div>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">优化建议</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.type === "critical"
                    ? "bg-red-50 border-red-500"
                    : suggestion.type === "warning"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {suggestion.title}
                    </h4>
                    <p className="text-gray-600 mt-1">
                      {suggestion.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">建议行动:</span>{" "}
                      {suggestion.action}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.impact === "high"
                          ? "bg-red-100 text-red-800"
                          : suggestion.impact === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {suggestion.impact} impact
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium mt-1 ${
                        suggestion.effort === "low"
                          ? "bg-green-100 text-green-800"
                          : suggestion.effort === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {suggestion.effort} effort
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!metrics && !isMonitoring && (
        <div className="text-center py-8 text-gray-500">
          点击&quot;开始监控&quot;按钮来收集性能指标
        </div>
      )}
    </div>
  );
}
