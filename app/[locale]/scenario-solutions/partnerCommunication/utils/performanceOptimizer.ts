import { logInfo } from "@/lib/debug-logger";

/**
 * 性能优化工具类
 * 提供状态更新优化、防抖、节流等功能
 */

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 状态更新优化器
export class StateUpdateOptimizer {
  private static instance: StateUpdateOptimizer;
  private updateQueue: Map<string, unknown> = new Map();
  private batchUpdateTimer: NodeJS.Timeout | null = null;
  private readonly batchDelay = 16; // 16ms，约60fps

  private constructor() {}

  public static getInstance(): StateUpdateOptimizer {
    if (!StateUpdateOptimizer.instance) {
      StateUpdateOptimizer.instance = new StateUpdateOptimizer();
    }
    return StateUpdateOptimizer.instance;
  }

  // 批量更新状态
  public batchUpdate(
    key: string,
    value: unknown,
    updateFn: (updates: Record<string, unknown>) => void,
  ): void {
    this.updateQueue.set(key, value);

    if (this.batchUpdateTimer) {
      clearTimeout(this.batchUpdateTimer);
    }

    this.batchUpdateTimer = setTimeout(() => {
      const updates = Object.fromEntries(this.updateQueue) as Record<
        string,
        unknown
      >;
      updateFn(updates);
      this.updateQueue.clear();
      this.batchUpdateTimer = null;
    }, this.batchDelay);
  }

  // 防抖更新
  public debouncedUpdate<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number = 300,
  ): (...args: Parameters<T>) => void {
    return debounce(func, wait);
  }

  // 节流更新
  public throttledUpdate<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number = 100,
  ): (...args: Parameters<T>) => void {
    return throttle(func, limit);
  }
}

// 选择器优化器
export class SelectorOptimizer {
  private static instance: SelectorOptimizer;
  private selectorCache: Map<string, unknown> = new Map();
  private readonly maxCacheSize = 100;

  private constructor() {}

  public static getInstance(): SelectorOptimizer {
    if (!SelectorOptimizer.instance) {
      SelectorOptimizer.instance = new SelectorOptimizer();
    }
    return SelectorOptimizer.instance;
  }

  // 创建优化的选择器
  public createOptimizedSelector<T>(
    selector: (state: unknown) => T,
    key: string,
  ): (state: unknown) => T {
    return (state: unknown): T => {
      const cacheKey = `${key}_${JSON.stringify(state)}`;

      if (this.selectorCache.has(cacheKey)) {
        return this.selectorCache.get(cacheKey) as T;
      }

      const result = selector(state);

      // 限制缓存大小
      if (this.selectorCache.size >= this.maxCacheSize) {
        const firstKey = this.selectorCache.keys().next().value;
        if (firstKey !== undefined) {
          this.selectorCache.delete(firstKey);
        }
      }

      this.selectorCache.set(cacheKey, result);
      return result;
    };
  }

  // 清除选择器缓存
  public clearCache(): void {
    this.selectorCache.clear();
  }

  // 清除特定选择器缓存
  public clearSelectorCache(key: string): void {
    for (const [cacheKey] of this.selectorCache) {
      if (cacheKey.startsWith(key)) {
        this.selectorCache.delete(cacheKey);
      }
    }
  }
}

// 渲染优化器
export class RenderOptimizer {
  private static instance: RenderOptimizer;
  private renderQueue: Set<string> = new Set();
  private renderTimer: NodeJS.Timeout | null = null;
  private readonly renderDelay = 16; // 16ms，约60fps

  private constructor() {}

  public static getInstance(): RenderOptimizer {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer();
    }
    return RenderOptimizer.instance;
  }

  // 批量渲染
  public batchRender(componentId: string, renderFn: () => void): void {
    this.renderQueue.add(componentId);

    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
    }

    this.renderTimer = setTimeout(() => {
      for (const componentId of this.renderQueue) {
        void componentId;
        renderFn();
      }
      this.renderQueue.clear();
      this.renderTimer = null;
    }, this.renderDelay);
  }

  // 防抖渲染
  public debouncedRender(
    componentId: string,
    renderFn: () => void,
    wait: number = 100,
  ): void {
    const debouncedFn = debounce(renderFn, wait);
    debouncedFn();
  }

  // 节流渲染
  public throttledRender(
    componentId: string,
    renderFn: () => void,
    limit: number = 100,
  ): void {
    const throttledFn = throttle(renderFn, limit);
    throttledFn();
  }
}

// 内存优化器
export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private memoryUsage: Map<string, number> = new Map();
  private readonly maxMemoryUsage = 50 * 1024 * 1024; // 50MB

  private constructor() {}

  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  // 监控内存使用
  public monitorMemoryUsage(key: string, size: number): void {
    this.memoryUsage.set(key, size);

    const totalUsage = Array.from(this.memoryUsage.values()).reduce(
      (sum, size) => sum + size,
      0,
    );

    if (totalUsage > this.maxMemoryUsage) {
      this.cleanupMemory();
    }
  }

  // 清理内存
  public cleanupMemory(): void {
    // 清理最旧的内存使用记录
    const sortedEntries = Array.from(this.memoryUsage.entries()).sort(
      ([, a], [, b]) => a - b,
    );

    const toRemove = Math.floor(sortedEntries.length * 0.3); // 清理30%

    for (let i = 0; i < toRemove; i++) {
      this.memoryUsage.delete(sortedEntries[i][0]);
    }

    logInfo(
      "🧹 内存清理完成",
      undefined,
      "performanceOptimizer/MemoryOptimizer/cleanupMemory",
    );
  }

  // 获取内存使用统计
  public getMemoryStats(): { total: number; entries: number; average: number } {
    const total = Array.from(this.memoryUsage.values()).reduce(
      (sum, size) => sum + size,
      0,
    );
    const entries = this.memoryUsage.size;
    const average = entries > 0 ? total / entries : 0;

    return { total, entries, average };
  }
}

// 性能监控器
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private readonly maxMetrics = 100;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 记录性能指标
  public recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // 限制指标数量
    if (values.length > this.maxMetrics) {
      values.shift();
    }
  }

  // 获取性能统计
  public getStats(
    name: string,
  ): { min: number; max: number; avg: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const count = values.length;

    return { min, max, avg, count };
  }

  // 清除性能指标
  public clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

// 导出单例实例
export const stateOptimizer = StateUpdateOptimizer.getInstance();
export const selectorOptimizer = SelectorOptimizer.getInstance();
export const renderOptimizer = RenderOptimizer.getInstance();
export const memoryOptimizer = MemoryOptimizer.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
