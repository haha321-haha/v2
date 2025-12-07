/**
 * 性能优化工具 - 基于ziV1d3d的性能优化
 * 提供性能监控和优化功能
 */

import { ComponentType, memo, MemoExoticComponent } from "react";
import { logWarn } from "@/lib/debug-logger";

type TimeoutHandle = ReturnType<typeof setTimeout>;

// 基于ziV1d3d的性能监控
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 开始性能测量 - 基于ziV1d3d的测量逻辑
  startMeasure(name: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      this.metrics.set(`${name}_start`, performance.now());
    }
  }

  // 结束性能测量 - 基于ziV1d3d的测量逻辑
  endMeasure(name: string): number {
    const startTime = this.metrics.get(`${name}_start`);
    if (!startTime) {
      logWarn(`Performance measure "${name}" was not started`);
      return 0;
    }

    if (typeof window !== "undefined" && "performance" in window) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.metrics.set(name, duration);
      this.metrics.delete(`${name}_start`);

      return duration;
    }

    this.metrics.delete(`${name}_start`);
    return 0;
  }

  // 获取性能指标 - 基于ziV1d3d的指标获取
  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      if (!key.includes("_start")) {
        result[key] = value;
      }
    });
    return result;
  }

  // 清除性能指标 - 基于ziV1d3d的清理逻辑
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// 基于ziV1d3d的防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: TimeoutHandle | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 基于ziV1d3d的节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 基于ziV1d3d的懒加载函数
export function lazyLoad<T>(
  importFn: () => Promise<T>,
  fallback?: T,
): () => Promise<T> {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = importFn().catch((error) => {
        promise = null;
        if (fallback) {
          return fallback;
        }
        throw error;
      });
    }
    return promise;
  };
}

// 基于ziV1d3d的内存优化
export class MemoryOptimizer {
  private static cache = new Map<string, unknown>();
  private static maxCacheSize = 100;

  // 缓存数据 - 基于ziV1d3d的缓存逻辑
  static setCache(key: string, value: unknown): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  // 获取缓存数据 - 基于ziV1d3d的缓存获取
  static getCache(key: string): unknown {
    return this.cache.get(key) ?? null;
  }

  // 清除缓存 - 基于ziV1d3d的缓存清理
  static clearCache(): void {
    this.cache.clear();
  }

  // 获取缓存大小 - 基于ziV1d3d的缓存监控
  static getCacheSize(): number {
    return this.cache.size;
  }
}

// 基于ziV1d3d的渲染优化
export function optimizeRender<T extends Record<string, unknown>>(
  component: ComponentType<T>,
): MemoExoticComponent<ComponentType<T>> {
  return memo(component, (prevProps, nextProps) =>
    shallowEqual(prevProps, nextProps),
  );
}

function shallowEqual<T extends Record<string, unknown>>(
  objA: T,
  objB: T,
): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(objB, key) &&
      Object.is(objA[key], objB[key]),
  );
}

// 基于ziV1d3d的批量更新
export function batchUpdate(updates: (() => void)[]): void {
  // 基于ziV1d3d的批量更新逻辑
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}
