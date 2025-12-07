/**
 * Day 12: 性能优化工具
 * 基于HVsLYEp的性能需求，实现渲染性能优化和内存管理
 */

import { useCallback, useMemo, useRef, useEffect } from "react";
import { logInfo, logWarn, logError } from "@/lib/debug-logger";

/**
 * 性能监控器
 * 监控组件渲染性能，提供性能分析数据
 */
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();
  private static observers = new Map<string, PerformanceObserver>();

  /**
   * 开始性能测量
   */
  static startMeasure(name: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * 结束性能测量
   */
  static endMeasure(name: string): number {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name, "measure")[0];
      const duration = measure?.duration || 0;

      // 记录测量结果
      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }
      this.measurements.get(name)!.push(duration);

      // 清理标记
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);

      return duration;
    }
    return 0;
  }

  /**
   * 获取性能统计
   */
  static getPerformanceStats(name: string) {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) return null;

    const sorted = [...measurements].sort((a, b) => a - b);
    return {
      count: measurements.length,
      average:
        measurements.reduce((sum, val) => sum + val, 0) / measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  /**
   * 清理性能数据
   */
  static clearMeasurements(name?: string): void {
    if (name) {
      this.measurements.delete(name);
    } else {
      this.measurements.clear();
    }
  }

  /**
   * 监控Web Vitals
   */
  static observeWebVitals(): void {
    if (typeof window === "undefined") return;

    try {
      const observerOptions = { buffered: true };

      // 监控LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logInfo(
          "LCP measurement",
          { startTime: lastEntry?.startTime ?? 0 },
          "performanceOptimizer",
        );
      });
      lcpObserver.observe({
        entryTypes: ["largest-contentful-paint"],
        ...observerOptions,
      });
      this.observers.set("lcp", lcpObserver);

      // 监控FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEventTiming[];
        entries.forEach((entry) => {
          if (
            "processingStart" in entry &&
            entry.processingStart &&
            entry.startTime
          ) {
            logInfo(
              "FID measurement",
              { delay: entry.processingStart - entry.startTime },
              "performanceOptimizer",
            );
          }
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"], ...observerOptions });
      this.observers.set("fid", fidObserver);

      // 监控CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries() as LayoutShift[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        logInfo("CLS measurement", { value: clsValue }, "performanceOptimizer");
      });
      clsObserver.observe({ entryTypes: ["layout-shift"], ...observerOptions });
      this.observers.set("cls", clsObserver);
    } catch (error) {
      logWarn("Web Vitals监控初始化失败", error, "performanceOptimizer");
    }
  }

  /**
   * 停止所有监控
   */
  static stopAllObservers(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

type PerformanceMemorySnapshot = {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
};

/**
 * 内存使用监控器
 */
export class MemoryMonitor {
  /**
   * 获取内存使用情况
   */
  static getMemoryInfo(): PerformanceMemorySnapshot | null {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (
        performance as Performance & {
          memory?: PerformanceMemorySnapshot;
        }
      ).memory;

      if (!memory) {
        return null;
      }

      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * 检查内存泄漏
   */
  static checkMemoryLeak(): boolean {
    const memoryInfo = this.getMemoryInfo();
    if (!memoryInfo) return false;

    const usagePercentage =
      memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
    return usagePercentage > 0.8; // 超过80%认为可能存在内存泄漏
  }

  /**
   * 强制垃圾回收（仅在开发环境）
   */
  static forceGC(): void {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      const globalWindow = window as Window & { gc?: () => void };
      if (typeof globalWindow.gc === "function") {
        globalWindow.gc();
      }
    }
  }
}

/**
 * 渲染性能优化Hook
 * 提供组件渲染优化功能
 */
export function useRenderOptimization() {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    lastRenderTime.current = Date.now();
  });

  /**
   * 防抖渲染
   */
  const debouncedRender = useCallback(
    (callback: () => void, delay: number = 100) => {
      const timeoutId = setTimeout(callback, delay);
      return () => clearTimeout(timeoutId);
    },
    [],
  );

  /**
   * 节流渲染
   */
  const throttledRender = useCallback(
    (callback: () => void, delay: number = 100) => {
      const now = Date.now();
      if (now - lastRenderTime.current >= delay) {
        callback();
        lastRenderTime.current = now;
      }
    },
    [],
  );

  /**
   * 检查渲染频率
   */
  const checkRenderFrequency = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastRenderTime.current;
    const frequency = timeDiff > 0 ? 1000 / timeDiff : 0;

    if (frequency > 60) {
      // 超过60fps
      logWarn(
        "高频渲染检测",
        { frequency: frequency.toFixed(2) },
        "performanceOptimizer",
      );
    }

    return {
      renderCount: renderCount.current,
      lastRenderTime: lastRenderTime.current,
      frequency,
    };
  }, []);

  return {
    renderCount: renderCount.current,
    debouncedRender,
    throttledRender,
    checkRenderFrequency,
  };
}

/**
 * 状态优化Hook
 * 优化Zustand状态订阅性能
 */
export function useOptimizedSelector<T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean,
): (state: T) => R {
  const memoizedSelector = useMemo(() => {
    if (equalityFn) {
      return (state: T) => selector(state);
    }

    return selector;
  }, [selector, equalityFn]);

  return memoizedSelector;
}

/**
 * 组件缓存管理器
 */
export class ComponentCache {
  private static cache = new Map<string, unknown>();
  private static maxSize = 100;
  private static accessCount = new Map<string, number>();

  /**
   * 设置缓存
   */
  static set(key: string, value: unknown): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, value);
    this.accessCount.set(key, 1);
  }

  /**
   * 获取缓存
   */
  static get(key: string): unknown {
    const value = this.cache.get(key);
    if (value) {
      const count = this.accessCount.get(key) || 0;
      this.accessCount.set(key, count + 1);
    }
    return value;
  }

  /**
   * 检查缓存是否存在
   */
  static has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * 删除缓存
   */
  static delete(key: string): boolean {
    this.accessCount.delete(key);
    return this.cache.delete(key);
  }

  /**
   * 清理最少使用的缓存
   */
  private static evictLeastUsed(): void {
    let leastUsedKey = "";
    let leastUsedCount = Infinity;

    for (const [key, count] of this.accessCount.entries()) {
      if (count < leastUsedCount) {
        leastUsedCount = count;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.delete(leastUsedKey);
    }
  }

  /**
   * 清理所有缓存
   */
  static clear(): void {
    this.cache.clear();
    this.accessCount.clear();
  }

  /**
   * 获取缓存统计
   */
  static getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
    };
  }

  private static calculateHitRate(): number {
    const totalAccess = Array.from(this.accessCount.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
    const uniqueKeys = this.accessCount.size;
    return uniqueKeys > 0 ? (totalAccess - uniqueKeys) / totalAccess : 0;
  }
}

/**
 * 虚拟滚动优化器
 * 用于大列表的性能优化
 */
export class VirtualScrollOptimizer {
  private static itemHeight = 50;
  private static containerHeight = 400;
  private static overscan = 5;

  /**
   * 计算可见范围
   */
  static calculateVisibleRange(scrollTop: number, totalItems: number) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight),
      totalItems - 1,
    );

    return {
      startIndex: Math.max(0, startIndex - this.overscan),
      endIndex: Math.min(totalItems - 1, endIndex + this.overscan),
      totalHeight: totalItems * this.itemHeight,
      offsetY: startIndex * this.itemHeight,
    };
  }

  /**
   * 设置配置
   */
  static configure(config: {
    itemHeight?: number;
    containerHeight?: number;
    overscan?: number;
  }) {
    if (config.itemHeight) this.itemHeight = config.itemHeight;
    if (config.containerHeight) this.containerHeight = config.containerHeight;
    if (config.overscan) this.overscan = config.overscan;
  }
}

/**
 * 批量更新优化器
 * 优化批量状态更新性能
 */
export class BatchUpdateOptimizer {
  private static updateQueue: (() => void)[] = [];
  private static isProcessing = false;

  /**
   * 添加更新到队列
   */
  static enqueue(update: () => void): void {
    this.updateQueue.push(update);
    this.scheduleBatch();
  }

  /**
   * 调度批量更新
   */
  private static scheduleBatch(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    // 使用 requestAnimationFrame 确保在下一帧执行
    requestAnimationFrame(() => {
      const updates = [...this.updateQueue];
      this.updateQueue = [];

      // 执行所有更新
      updates.forEach((update) => {
        try {
          update();
        } catch (error) {
          logError("批量更新执行失败", error, "performanceOptimizer");
        }
      });

      this.isProcessing = false;

      // 如果还有新的更新，继续处理
      if (this.updateQueue.length > 0) {
        this.scheduleBatch();
      }
    });
  }

  /**
   * 清理队列
   */
  static clear(): void {
    this.updateQueue = [];
    this.isProcessing = false;
  }
}

// 导出所有性能优化工具
const performanceOptimizerTools = {
  PerformanceMonitor,
  MemoryMonitor,
  useRenderOptimization,
  useOptimizedSelector,
  ComponentCache,
  VirtualScrollOptimizer,
  BatchUpdateOptimizer,
};

export default performanceOptimizerTools;
