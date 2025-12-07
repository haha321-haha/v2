"use client";

import { useEffect } from "react";
import PerformanceMonitorComponent from "./PerformanceMonitor";
import { logInfo, logWarn } from "@/lib/debug-logger";

// 性能监控集成组件
export default function PerformanceIntegration() {
  useEffect(() => {
    // 只在生产环境或开发环境启用
    const isEnabled =
      process.env.NODE_ENV === "production" ||
      process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === "true";

    if (!isEnabled) return;

    // 添加性能监控到页面
    logInfo(
      "🚀 Performance monitoring enabled",
      undefined,
      "PerformanceIntegration/useEffect",
    );
  }, []);

  return (
    <PerformanceMonitorComponent
      enabled={
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === "true"
      }
      showConsole={process.env.NODE_ENV === "development"}
    />
  );
}

// 性能监控Hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 页面加载性能
    const handleLoad = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        logInfo(
          "📊 Page Load Performance:",
          {
            domContentLoaded:
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart,
          },
          "PerformanceIntegration/usePerformanceMonitoring",
        );
      }
    };

    // 资源加载性能
    const handleResourceTiming = () => {
      const resources = performance.getEntriesByType("resource");
      const slowResources = resources.filter(
        (resource) => resource.duration > 1000, // 超过1秒的资源
      );

      if (slowResources.length > 0) {
        logWarn(
          "⚠️ Slow resources detected:",
          slowResources.map((r) => ({
            name: r.name,
            duration: r.duration,
          })),
          "PerformanceIntegration/usePerformanceMonitoring",
        );
      }
    };

    window.addEventListener("load", handleLoad);
    window.addEventListener("load", handleResourceTiming);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("load", handleResourceTiming);
    };
  }, []);
}
