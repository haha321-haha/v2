/**
 * 监控设置 - 基于ziV1d3d的性能监控
 * 提供生产环境的监控和分析功能
 */

import { logWarn } from "@/lib/debug-logger";

type GtagConfig = {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_map?: Record<string, unknown>;
  description?: string;
  fatal?: boolean;
};

type PerformanceContext = {
  type?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  reason?: unknown;
};

type ErrorRecord = {
  error: Error;
  timestamp: number;
  context?: PerformanceContext;
};

type UserEventData = Record<string, unknown>;
type UserEvent = {
  event: string;
  timestamp: number;
  data?: UserEventData;
};

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: GtagConfig) => void;
  }
}

// 基于ziV1d3d的Web Vitals监控
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor();
    }
    return WebVitalsMonitor.instance;
  }

  // 基于ziV1d3d的CLS监控
  measureCLS(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "layout-shift") {
            const clsEntry = entry as LayoutShift;
            if (!clsEntry.hadRecentInput) {
              this.metrics.set(
                "CLS",
                (this.metrics.get("CLS") || 0) + (clsEntry.value || 0),
              );
            }
          }
        }
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    }
  }

  // 基于ziV1d3d的FID监控
  measureFID(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          const delta = fidEntry.processingStart - fidEntry.startTime;
          if (!Number.isNaN(delta)) {
            this.metrics.set("FID", delta);
          }
        }
      });
      observer.observe({ entryTypes: ["first-input"] });
    }
  }

  // 基于ziV1d3d的LCP监控
  measureLCP(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.set("LCP", lastEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    }
  }

  // 基于ziV1d3d的FCP监控
  measureFCP(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === "paint" &&
            entry.name === "first-contentful-paint"
          ) {
            this.metrics.set("FCP", entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ["paint"] });
    }
  }

  // 基于ziV1d3d的TTFB监控
  measureTTFB(): void {
    if (typeof window !== "undefined") {
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (navigation) {
        this.metrics.set(
          "TTFB",
          navigation.responseStart - navigation.requestStart,
        );
      }
    }
  }

  // 获取所有指标
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // 发送指标到分析服务
  sendMetrics(): void {
    const metrics = this.getAllMetrics();
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "web_vitals", {
        event_category: "Performance",
        event_label: "Nutrition Generator",
        value: Math.round(metrics.CLS || 0),
        custom_map: {
          CLS: metrics.CLS,
          FID: metrics.FID,
          LCP: metrics.LCP,
          FCP: metrics.FCP,
          TTFB: metrics.TTFB,
        },
      });
    } else {
      logWarn("window.gtag is not available, skipping web vitals upload");
    }
  }
}

// 基于ziV1d3d的错误监控
export class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errors: ErrorRecord[] = [];

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  // 初始化错误监控
  init(): void {
    if (typeof window !== "undefined") {
      // 全局错误捕获
      window.addEventListener("error", (event) => {
        this.captureError(event.error, {
          type: "javascript",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      // Promise错误捕获
      window.addEventListener("unhandledrejection", (event) => {
        this.captureError(new Error(`${event.reason}`), {
          type: "promise",
          reason: event.reason,
        });
      });
    }
  }

  // 捕获错误
  captureError(error: Error, context?: PerformanceContext): void {
    this.errors.push({
      error,
      timestamp: Date.now(),
      context,
    });

    // 发送到错误追踪服务
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
        custom_map: {
          stack: error.stack,
          context: JSON.stringify(context ?? {}),
        },
      });
    } else {
      logWarn("window.gtag is not available, skipping exception upload");
    }
  }

  // 获取错误统计
  getErrorStats(): {
    total: number;
    recent: number;
    byType: Record<string, number>;
  } {
    const now = Date.now();
    const recent = this.errors.filter((e) => now - e.timestamp < 3600000); // 1小时内
    const byType: Record<string, number> = {};

    this.errors.forEach((e) => {
      const type = e.context?.type || "unknown";
      byType[type] = (byType[type] || 0) + 1;
    });

    return {
      total: this.errors.length,
      recent: recent.length,
      byType,
    };
  }
}

// 基于ziV1d3d的用户行为监控
export class UserBehaviorMonitor {
  private static instance: UserBehaviorMonitor;
  private events: UserEvent[] = [];

  static getInstance(): UserBehaviorMonitor {
    if (!UserBehaviorMonitor.instance) {
      UserBehaviorMonitor.instance = new UserBehaviorMonitor();
    }
    return UserBehaviorMonitor.instance;
  }

  // 跟踪用户事件
  trackEvent(event: string, data?: UserEventData): void {
    this.events.push({
      event,
      timestamp: Date.now(),
      data,
    });

    // 发送到分析服务
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, {
        event_category: "User Interaction",
        event_label: "Nutrition Generator",
        value: 1,
        custom_map: data,
      });
    } else {
      logWarn("window.gtag is not available, skipping user event upload");
    }
  }

  // 跟踪页面访问
  trackPageView(page: string): void {
    this.trackEvent("page_view", { page });
  }

  // 跟踪选择操作
  trackSelection(category: string, value: string): void {
    this.trackEvent("selection", { category, value });
  }

  // 跟踪推荐生成
  trackRecommendationGeneration(selections: Record<string, unknown>): void {
    this.trackEvent("recommendation_generated", { selections });
  }

  // 跟踪语言切换
  trackLanguageSwitch(from: string, to: string): void {
    this.trackEvent("language_switch", { from, to });
  }

  // 获取用户行为统计
  getUserStats(): {
    totalEvents: number;
    uniquePages: number;
    topEvents: Record<string, number>;
  } {
    const pageValues = this.events
      .filter((e) => e.event === "page_view")
      .map((e) => e.data?.page)
      .filter((page): page is string => typeof page === "string");
    const uniquePages = new Set(pageValues);
    const topEvents: Record<string, number> = {};

    this.events.forEach((e) => {
      topEvents[e.event] = (topEvents[e.event] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      uniquePages: uniquePages.size,
      topEvents,
    };
  }
}
