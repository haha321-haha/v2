// 性能优化工具 - 基于技术日志的成功经验

import { lazy } from "react";
import React from "react";
import SafeSmartImage from "@/components/ui/SafeSmartImage";
import { logError } from "@/lib/debug-logger";

// 类型定义
interface MemoryInfo {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining(): number;
}

// 懒加载组件工厂
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
) {
  return lazy(async () => {
    try {
      // 添加最小加载时间，避免闪烁
      const [component] = await Promise.all([
        importFn(),
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]);
      return component;
    } catch (error) {
      logError(
        "Component lazy loading failed:",
        error,
        "performanceOptimizer/createLazyComponent",
      );
      // 返回错误组件
      return {
        default:
          fallback ||
          (() =>
            React.createElement(
              "div",
              {
                className:
                  "bg-red-50 border border-red-200 rounded-lg p-4 my-4",
              },
              React.createElement(
                "p",
                {
                  className: "text-red-700",
                },
                "组件加载失败，请刷新页面重试。",
              ),
            )),
      };
    }
  });
}

// 预加载关键组件
export function preloadComponents() {
  if (typeof window !== "undefined") {
    // 在空闲时间预加载组件
    const preloadComponent = <T extends React.ComponentType<unknown>>(
      importFn: () => Promise<{ default: T }>,
    ) => {
      if ("requestIdleCallback" in window) {
        (
          window as Window & {
            requestIdleCallback(cb: IdleRequestCallback): void;
          }
        ).requestIdleCallback(() => {
          importFn().catch((error) =>
            logError(
              "Component preload failed:",
              error,
              "performanceOptimizer/preloadComponent",
            ),
          );
        });
      } else {
        setTimeout(() => {
          importFn().catch((error) =>
            logError(
              "Component preload failed:",
              error,
              "performanceOptimizer/preloadComponent",
            ),
          );
        }, 1000);
      }
    };

    // 预加载核心组件
    preloadComponent(() => import("../components/PainAssessmentTool"));
    preloadComponent(() => import("../components/SymptomChecklist"));
    preloadComponent(() => import("../components/DecisionTree"));
    preloadComponent(() => import("../components/ComparisonTable"));
  }
}

// 性能监控
export class MedicalCareGuidePerformanceMonitor {
  private static instance: MedicalCareGuidePerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): MedicalCareGuidePerformanceMonitor {
    if (!this.instance) {
      this.instance = new MedicalCareGuidePerformanceMonitor();
    }
    return this.instance;
  }

  // 记录组件加载时间
  recordComponentLoad(componentName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.set(`${componentName}_load_time`, loadTime);

    // 发送到分析服务（如果配置了）
    if (
      typeof window !== "undefined" &&
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag
    ) {
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag("event", "component_load", {
        component_name: componentName,
        load_time: Math.round(loadTime),
        page: "medical-care-guide",
      } as Record<string, unknown>);
    }
  }

  // 记录用户交互
  recordUserInteraction(interaction: string, componentName: string) {
    const timestamp = Date.now();
    this.metrics.set(`${componentName}_${interaction}_time`, timestamp);

    if (
      typeof window !== "undefined" &&
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag
    ) {
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag("event", "user_interaction", {
        interaction_type: interaction,
        component_name: componentName,
        page: "medical-care-guide",
      } as Record<string, unknown>);
    }
  }

  // 记录评估完成
  recordAssessmentCompletion(assessmentType: string, duration: number) {
    this.metrics.set(`${assessmentType}_completion_time`, duration);

    if (
      typeof window !== "undefined" &&
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag
    ) {
      (
        window as unknown as Window & {
          gtag?: (command: string, params: Record<string, unknown>) => void;
        }
      ).gtag("event", "assessment_completed", {
        assessment_type: assessmentType,
        duration: Math.round(duration),
        page: "medical-care-guide",
      } as Record<string, unknown>);
    }
  }

  // 获取性能指标
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // 清除指标
  clearMetrics() {
    this.metrics.clear();
  }
}

// 错误边界HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>,
) {
  return function WrappedComponent(props: P) {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setHasError(true);
        setError(new Error(event.message));
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        setHasError(true);
        setError(new Error(event.reason));
      };

      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleUnhandledRejection);

      return () => {
        window.removeEventListener("error", handleError);
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection,
        );
      };
    }, []);

    const retry = () => {
      setHasError(false);
      setError(null);
    };

    if (hasError) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent error={error!} retry={retry} />;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            组件出现错误
          </h3>
          <p className="text-red-700 mb-4">{error?.message || "未知错误"}</p>
          <button
            onClick={retry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// 图片懒加载
export function LazyImage({
  src,
  alt,
  className = "",
  placeholder = "/images/placeholder.svg",
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SafeSmartImage
      src={isInView ? src : placeholder}
      alt={alt}
      width={400}
      height={300}
      className={`transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-50"
      } ${className}`}
      onLoad={() => setIsLoaded(true)}
      priority={false}
      type="content"
    />
  );
}

// 防抖Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 节流Hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = React.useRef(Date.now());

  React.useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current),
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// 内存使用监控
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = React.useState<{
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  React.useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        setMemoryInfo(
          (performance as Performance & { memory?: MemoryInfo }).memory || null,
        );
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}
