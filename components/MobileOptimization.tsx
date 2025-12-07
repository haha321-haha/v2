"use client";

import { useEffect } from "react";
import {
  initMobileOptimization,
  optimizeTouchEvents,
  isMobile,
} from "@/lib/mobile-performance";
import { logInfo, logWarn } from "@/lib/debug-logger";

/**
 * 移动端优化组件
 * 负责初始化所有移动端性能优化功能
 */
export default function MobileOptimization() {
  useEffect(() => {
    // 初始化移动端优化
    initMobileOptimization();

    // 优化触摸事件
    optimizeTouchEvents();

    // 添加移动端特定的meta标签
    if (isMobile()) {
      addMobileMetaTags();
    }

    // 设置viewport优化
    optimizeViewport();

    // 预加载关键资源
    preloadCriticalResources();

    // 性能监控
    setupPerformanceMonitoring();
  }, []);

  return null; // 这是一个无UI的组件
}

// 添加移动端特定的meta标签
function addMobileMetaTags() {
  // 检查是否已经有相关meta标签
  if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
    const meta1 = document.createElement("meta");
    meta1.name = "mobile-web-app-capable";
    meta1.content = "yes";
    document.head.appendChild(meta1);
  }

  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const meta2 = document.createElement("meta");
    meta2.name = "apple-mobile-web-app-capable";
    meta2.content = "yes";
    document.head.appendChild(meta2);
  }

  if (
    !document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    )
  ) {
    const meta3 = document.createElement("meta");
    meta3.name = "apple-mobile-web-app-status-bar-style";
    meta3.content = "default";
    document.head.appendChild(meta3);
  }

  if (!document.querySelector('meta[name="format-detection"]')) {
    const meta4 = document.createElement("meta");
    meta4.name = "format-detection";
    meta4.content = "telephone=no";
    document.head.appendChild(meta4);
  }
}

// 优化viewport设置
function optimizeViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // 移动端优化viewport
    if (isMobile()) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      );
    }
  }
}

// 预加载关键资源
function preloadCriticalResources() {
  const criticalResources = [
    {
      href: "/fonts/Noto_Sans_SC/static/NotoSansSC-Regular.ttf",
      as: "font",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    {
      href: "/fonts/Noto_Sans_SC/static/NotoSansSC-Medium.ttf",
      as: "font",
      type: "font/ttf",
      crossorigin: "anonymous",
    },
    { href: "/images/hero-bg.jpg", as: "image" },
    { href: "/icon.svg", as: "image" },
  ];

  criticalResources.forEach((resource) => {
    // 检查是否已经预加载
    const existing = document.querySelector(`link[href="${resource.href}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource.href;
      link.as = resource.as;

      if (resource.type) {
        link.type = resource.type;
      }

      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }

      document.head.appendChild(link);
    }
  });
}

// 设置性能监控
function setupPerformanceMonitoring() {
  // 监控页面加载性能
  window.addEventListener("load", () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.fetchStart,
        };

        logInfo("Page Load Metrics:", metrics, "MobileOptimization");

        // 发送性能数据到分析服务
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
          ).gtag("event", "page_load_performance", {
            custom_map: metrics,
          });
        }

        // 如果性能较差，记录警告
        if (metrics.total > 3000) {
          logWarn(
            "Slow page load detected:",
            metrics.total + "ms",
            "MobileOptimization",
          );
        }
      }
    }, 0);
  });

  // 监控用户交互性能
  ["click", "touchstart", "keydown"].forEach((eventType) => {
    document.addEventListener(
      eventType,
      () => {
        // Track interaction start time for performance monitoring
        void performance.now();
      },
      { passive: true },
    );
  });

  // 监控长任务
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          logWarn(
            "Long task detected:",
            entry.duration + "ms",
            "MobileOptimization",
          );

          // 发送长任务数据
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
            ).gtag("event", "long_task", {
              duration: entry.duration,
              start_time: entry.startTime,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ["longtask"] });
  }
}
