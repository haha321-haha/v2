/**
 * 搜索性能优化工具
 * 实现搜索结果缓存和性能监控
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * LRU缓存实现
 */
export class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private ttl: number; // 缓存过期时间（毫秒）

  constructor(maxSize: number = 50, ttl: number = 300000) {
    // 默认5分钟
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 检查是否过期
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // LRU: 移到最后（最近使用）
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(key: string, data: T): void {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // 如果缓存已满，删除最旧的项（第一个）
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // 添加新项
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }
}

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]>;

  constructor() {
    this.metrics = new Map();
  }

  startTimer(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);

    // 只保留最近100条记录
    const values = this.metrics.get(label)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getStats(label: string) {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) {
      return null;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      average: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
    };
  }

  getAllStats() {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {};
    this.metrics.forEach((_, label) => {
      stats[label] = this.getStats(label);
    });
    return stats;
  }

  clear(): void {
    this.metrics.clear();
  }
}

// 全局实例
export const searchCache = new LRUCache<unknown>(50, 300000);
export const performanceMonitor = new PerformanceMonitor();
