"use client";

import { useEffect } from "react";
import { logWarn, logInfo } from "@/lib/debug-logger";

interface Metric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

export function WebVitalsReporter() {
  useEffect(() => {
    // 使用web-vitals库进行Core Web Vitals监控
    import("web-vitals")
      .then((webVitals) => {
        // 注意：跳过已废弃的FID，使用新的API
        webVitals.onCLS(sendToAnalytics);
        webVitals.onFCP(sendToAnalytics);
        webVitals.onLCP(sendToAnalytics);
        webVitals.onTTFB(sendToAnalytics);

        // INP现在有官方支持
        webVitals.onINP(sendToAnalytics);
      })
      .catch((error) => {
        logWarn(
          "Failed to load web-vitals:",
          error,
          "WebVitalsReporter/useEffect",
        );
      });
  }, []);

  function sendToAnalytics(metric: Metric) {
    // 跳过已废弃的FID指标
    if (metric.name === "FID") return;

    // 发送到分析服务
    if (
      typeof window !== "undefined" &&
      "gtag" in window &&
      typeof (
        window as {
          gtag?: (
            command: string,
            eventName: string,
            params?: Record<string, unknown>,
          ) => void;
        }
      ).gtag === "function"
    ) {
      (
        window as {
          gtag: (
            command: string,
            eventName: string,
            params?: Record<string, unknown>,
          ) => void;
        }
      ).gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        non_interaction: true,
      });
    }

    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === "development") {
      logInfo(
        `📊 ${metric.name}: ${metric.value} (${metric.rating})`,
        metric,
        "WebVitalsReporter/sendToAnalytics",
      );
    }

    // 发送到自定义分析端点（仅在开发环境且API可用时）
    if (process.env.NODE_ENV === "development") {
      try {
        fetch("/api/analytics/web-vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metric),
        }).catch((error) => {
          // 静默处理fetch错误，避免影响页面功能
          logWarn(
            "Web Vitals API不可用:",
            error,
            "WebVitalsReporter/sendToAnalytics",
          );
        });
      } catch (error) {
        // 捕获同步错误
        logWarn(
          "Web Vitals发送失败:",
          error,
          "WebVitalsReporter/sendToAnalytics",
        );
      }
    }
  }

  return null;
}

// 性能优化Hook
export function usePerformanceOptimization() {
  useEffect(() => {
    // 预加载关键资源
    const criticalResources = ["/api/user/profile", "/api/period/current"];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource;
      document.head.appendChild(link);
    });

    // 延迟加载非关键资源
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      observer.observe(img);
    });

    return () => observer.disconnect();
  }, []);
}
