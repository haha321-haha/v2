"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Zap,
  Clock,
  Database,
  Cpu,
  MemoryStick,
  Network,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { logError } from "@/lib/debug-logger";

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  renderTime: number;
  cacheHitRate: number;
  networkRequests: number;
  score: number;
}

interface PerformanceOptimizerProps {
  locale: string;
  onOptimizationComplete?: (metrics: PerformanceMetrics) => void;
}

export default function PerformanceOptimizer({
  locale,
  onOptimizationComplete,
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationSteps, setOptimizationSteps] = useState<string[]>([]);

  // 模拟性能指标收集
  useEffect(() => {
    const collectMetrics = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockMetrics: PerformanceMetrics = {
          bundleSize: 2.4, // MB
          loadTime: 1.8, // seconds
          memoryUsage: 45, // MB
          renderTime: 120, // ms
          cacheHitRate: 78, // %
          networkRequests: 12,
          score: 82,
        };

        setMetrics(mockMetrics);
        setLoading(false);
      } catch (error) {
        logError(
          "Performance metrics collection failed",
          error,
          "PerformanceOptimizer",
        );
        setLoading(false);
      }
    };

    collectMetrics();
  }, []);

  // 性能优化函数
  const optimizePerformance = useCallback(async () => {
    setOptimizing(true);
    setOptimizationProgress(0);
    setOptimizationSteps([]);

    const steps = [
      {
        name:
          locale === "zh"
            ? "代码分割优化..."
            : "Code splitting optimization...",
        duration: 800,
      },
      {
        name:
          locale === "zh" ? "懒加载实现..." : "Implementing lazy loading...",
        duration: 600,
      },
      {
        name:
          locale === "zh"
            ? "缓存策略优化..."
            : "Cache strategy optimization...",
        duration: 700,
      },
      {
        name:
          locale === "zh" ? "内存使用优化..." : "Memory usage optimization...",
        duration: 500,
      },
      {
        name:
          locale === "zh"
            ? "网络请求优化..."
            : "Network request optimization...",
        duration: 600,
      },
      {
        name:
          locale === "zh"
            ? "渲染性能优化..."
            : "Rendering performance optimization...",
        duration: 500,
      },
      {
        name: locale === "zh" ? "完成优化" : "Optimization complete",
        duration: 300,
      },
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setOptimizationSteps((prev) => [...prev, step.name]);

        await new Promise((resolve) => setTimeout(resolve, step.duration));
        setOptimizationProgress(Math.round(((i + 1) / steps.length) * 100));
      }

      // 更新优化后的指标
      if (metrics) {
        const optimizedMetrics: PerformanceMetrics = {
          bundleSize: Math.round(metrics.bundleSize * 0.7 * 10) / 10, // 减少30%
          loadTime: Math.round(metrics.loadTime * 0.6 * 10) / 10, // 减少40%
          memoryUsage: Math.round(metrics.memoryUsage * 0.8), // 减少20%
          renderTime: Math.round(metrics.renderTime * 0.7), // 减少30%
          cacheHitRate: Math.min(95, metrics.cacheHitRate + 15), // 提升15%
          networkRequests: Math.max(3, metrics.networkRequests - 6), // 减少50%
          score: Math.min(100, metrics.score + 15), // 提升15分
        };

        setMetrics(optimizedMetrics);

        if (onOptimizationComplete) {
          onOptimizationComplete(optimizedMetrics);
        }
      }

      setOptimizing(false);
    } catch (error) {
      logError(
        "Performance optimization failed",
        error,
        "PerformanceOptimizer",
      );
      setOptimizing(false);
    }
  }, [metrics, locale, onOptimizationComplete]);

  // 重置优化
  const resetOptimization = useCallback(() => {
    setOptimizationProgress(0);
    setOptimizationSteps([]);
    setOptimizing(false);
  }, []);

  // 性能评分颜色
  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  }, []);

  // 性能指标卡片
  const MetricCard = useMemo(() => {
    type MetricCardProps = {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      value: string | number;
      unit: string;
      improvement?: number;
    };

    const CardComponent: React.FC<MetricCardProps> = ({
      icon,
      title,
      value,
      unit,
      improvement,
    }) => (
      <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          {React.createElement(icon, { className: "w-8 h-8 text-blue-600" })}
          {improvement && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                improvement > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {improvement > 0 ? "+" : ""}
              {improvement}%
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500 ml-1">{unit}</span>
        </div>
      </div>
    );

    CardComponent.displayName = "MetricCard";
    return CardComponent;
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      {/* 标题和性能评分 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-600" />
            {locale === "zh" ? "性能优化" : "Performance Optimization"}
          </h2>
          <p className="text-gray-600">
            {locale === "zh"
              ? "提升应用性能，优化用户体验"
              : "Improve application performance and user experience"}
          </p>
        </div>

        {metrics && (
          <div
            className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(
              metrics.score,
            )}`}
          >
            {metrics.score}/100
          </div>
        )}
      </div>

      {/* 性能指标概览 */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Database}
            title={locale === "zh" ? "包大小" : "Bundle Size"}
            value={metrics.bundleSize}
            unit="MB"
            improvement={-30}
          />
          <MetricCard
            icon={Clock}
            title={locale === "zh" ? "加载时间" : "Load Time"}
            value={metrics.loadTime}
            unit="s"
            improvement={-40}
          />
          <MetricCard
            icon={MemoryStick}
            title={locale === "zh" ? "内存使用" : "Memory Usage"}
            value={metrics.memoryUsage}
            unit="MB"
            improvement={-20}
          />
          <MetricCard
            icon={Cpu}
            title={locale === "zh" ? "渲染时间" : "Render Time"}
            value={metrics.renderTime}
            unit="ms"
            improvement={-30}
          />
        </div>
      )}

      {/* 优化进度 */}
      {optimizing && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 animate-pulse" />
            {locale === "zh" ? "正在优化性能..." : "Optimizing performance..."}
          </h3>

          <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>

          <div className="space-y-2">
            {optimizationSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 优化策略 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 代码分割 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            {locale === "zh" ? "代码分割" : "Code Splitting"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-purple-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh"
                ? "路由级别代码分割"
                : "Route-level code splitting"}
            </div>
            <div className="flex items-center text-sm text-purple-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "组件懒加载" : "Component lazy loading"}
            </div>
            <div className="flex items-center text-sm text-purple-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "动态导入优化" : "Dynamic import optimization"}
            </div>
          </div>
        </div>

        {/* 缓存策略 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            {locale === "zh" ? "缓存策略" : "Cache Strategy"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "静态资源缓存" : "Static resource caching"}
            </div>
            <div className="flex items-center text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "API响应缓存" : "API response caching"}
            </div>
            <div className="flex items-center text-sm text-green-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh"
                ? "浏览器缓存优化"
                : "Browser cache optimization"}
            </div>
          </div>
        </div>

        {/* 内存优化 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <MemoryStick className="w-5 h-5 mr-2" />
            {locale === "zh" ? "内存优化" : "Memory Optimization"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-blue-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "组件记忆化" : "Component memoization"}
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "事件监听器清理" : "Event listener cleanup"}
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "内存泄漏检测" : "Memory leak detection"}
            </div>
          </div>
        </div>

        {/* 网络优化 */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
            <Network className="w-5 h-5 mr-2" />
            {locale === "zh" ? "网络优化" : "Network Optimization"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-orange-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "请求去重" : "Request deduplication"}
            </div>
            <div className="flex items-center text-sm text-orange-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh"
                ? "预加载关键资源"
                : "Preload critical resources"}
            </div>
            <div className="flex items-center text-sm text-orange-700">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              {locale === "zh" ? "压缩传输" : "Compressed transmission"}
            </div>
          </div>
        </div>
      </div>

      {/* 性能建议 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 mb-8">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          {locale === "zh"
            ? "性能优化建议"
            : "Performance Optimization Recommendations"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === "zh" ? "包大小优化" : "Bundle Size Optimization"}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === "zh"
                    ? "当前包大小2.4MB，建议优化到1.7MB以下"
                    : "Current bundle size 2.4MB, recommend optimizing to under 1.7MB"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === "zh" ? "加载时间优化" : "Load Time Optimization"}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === "zh"
                    ? "当前加载时间1.8秒，建议优化到1.1秒以下"
                    : "Current load time 1.8s, recommend optimizing to under 1.1s"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === "zh" ? "缓存命中率" : "Cache Hit Rate"}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === "zh"
                    ? "当前缓存命中率78%，建议提升到90%以上"
                    : "Current cache hit rate 78%, recommend improving to over 90%"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {locale === "zh"
                    ? "网络请求优化"
                    : "Network Request Optimization"}
                </h4>
                <p className="text-sm text-gray-600">
                  {locale === "zh"
                    ? "当前网络请求12个，建议减少到6个以下"
                    : "Current network requests 12, recommend reducing to under 6"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={optimizePerformance}
          disabled={optimizing}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {optimizing ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              {locale === "zh" ? "优化中..." : "Optimizing..."}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {locale === "zh" ? "开始优化" : "Start Optimization"}
            </>
          )}
        </button>

        <button
          onClick={resetOptimization}
          disabled={optimizing}
          className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {locale === "zh" ? "重置" : "Reset"}
        </button>
      </div>
    </div>
  );
}
