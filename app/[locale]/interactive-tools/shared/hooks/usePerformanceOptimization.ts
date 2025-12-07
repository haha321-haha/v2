"use client";

import { useState, useCallback, useMemo, type DependencyList } from "react";
import { logInfo } from "@/lib/debug-logger";

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
}

export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableMemoization: boolean;
  enableCodeSplitting: boolean;
  enableImageOptimization: boolean;
  enableBundleAnalysis: boolean;
  maxCacheSize: number;
  debounceDelay: number;
}

interface PerformanceMemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

type PerformanceWithMemory = Performance & {
  memory?: PerformanceMemoryInfo;
};

const DEFAULT_CONFIG: PerformanceConfig = {
  enableLazyLoading: true,
  enableMemoization: true,
  enableCodeSplitting: true,
  enableImageOptimization: true,
  enableBundleAnalysis: false,
  maxCacheSize: 50, // MB
  debounceDelay: 300, // ms
};

export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  });

  const [config, setConfig] = useState<PerformanceConfig>(DEFAULT_CONFIG);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Performance monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);

    // Monitor load time
    const loadStart = performance.now();

    // Monitor memory usage
    const updateMemoryUsage = () => {
      const memory = (performance as PerformanceWithMemory).memory;

      if (memory) {
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        }));
      }
    };

    // Monitor network requests
    const originalFetch = window.fetch;
    const boundOriginalFetch = originalFetch.bind(window);
    let requestCount = 0;

    window.fetch = (...args: Parameters<typeof window.fetch>) => {
      requestCount++;
      setMetrics((prev) => ({
        ...prev,
        networkRequests: requestCount,
      }));
      return boundOriginalFetch(...args);
    };

    // Update metrics periodically
    const interval = setInterval(() => {
      updateMemoryUsage();

      const loadTime = performance.now() - loadStart;
      setMetrics((prev) => ({
        ...prev,
        loadTime: Math.round(loadTime),
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      window.fetch = originalFetch;
      setIsMonitoring(false);
    };
  }, []);

  // Debounced function wrapper
  const debounce = useCallback(
    <T extends (...args: unknown[]) => unknown>(
      func: T,
      delay: number = config.debounceDelay,
    ): T => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return ((...args: Parameters<T>) => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
      }) as T;
    },
    [config.debounceDelay],
  );

  // Throttled function wrapper
  const throttle = useCallback(
    <T extends (...args: unknown[]) => unknown>(
      func: T,
      delay: number = config.debounceDelay,
    ): T => {
      let lastCall = 0;

      return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          func(...args);
        }
      }) as T;
    },
    [config.debounceDelay],
  );

  // Memoized value wrapper
  // Note: This function cannot use useMemo inside a callback
  // Users should call useMemo directly instead
  const memoize = useCallback(<T>(value: T, _deps: DependencyList): T => {
    void _deps;
    return value;
  }, []);

  // Lazy loading helper
  const lazyLoad = useCallback(
    <T>(importFn: () => Promise<T>): Promise<T> => {
      if (!config.enableLazyLoading) {
        return importFn();
      }

      return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Lazy loading timeout"));
        }, 10000); // 10 second timeout

        importFn()
          .then((module) => {
            clearTimeout(timeout);
            resolve(module);
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      });
    },
    [config.enableLazyLoading],
  );

  // Cache management
  const cache = useMemo(() => new Map<string, unknown>(), []);

  const getCachedValue = useCallback(
    (key: string) => {
      return cache.get(key);
    },
    [cache],
  );

  const setCachedValue = useCallback(
    (key: string, value: unknown) => {
      // Check cache size limit
      if (cache.size >= config.maxCacheSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    [cache, config.maxCacheSize],
  );

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  // Image optimization
  const optimizeImage = useCallback(
    (
      src: string,
      options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: "webp" | "jpeg" | "png";
      } = {},
    ) => {
      if (!config.enableImageOptimization) {
        return src;
      }

      const { width, height, quality = 80, format = "webp" } = options;
      const params = new URLSearchParams();

      if (width) params.set("w", width.toString());
      if (height) params.set("h", height.toString());
      params.set("q", quality.toString());
      params.set("f", format);

      return `${src}?${params.toString()}`;
    },
    [config.enableImageOptimization],
  );

  // Bundle analysis (development only)
  const analyzeBundle = useCallback(() => {
    if (
      !config.enableBundleAnalysis ||
      process.env.NODE_ENV !== "development"
    ) {
      return null;
    }

    // This would integrate with webpack-bundle-analyzer or similar tools
    logInfo(
      "Bundle analysis would be performed here",
      undefined,
      "usePerformanceOptimization",
    );
    return {
      totalSize: 0,
      chunkSizes: {},
      duplicateModules: [],
    };
  }, [config.enableBundleAnalysis]);

  // Performance recommendations
  const getPerformanceRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.loadTime > 3000) {
      recommendations.push(
        "Consider implementing code splitting to reduce initial bundle size",
      );
    }

    if (metrics.memoryUsage > 100) {
      recommendations.push(
        "High memory usage detected. Consider optimizing component rendering",
      );
    }

    if (metrics.networkRequests > 20) {
      recommendations.push(
        "High number of network requests. Consider implementing request batching",
      );
    }

    if (metrics.cacheHitRate < 0.5) {
      recommendations.push(
        "Low cache hit rate. Consider improving caching strategy",
      );
    }

    return recommendations;
  }, [metrics]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<PerformanceConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics({
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      cacheHitRate: 0,
    });
  }, []);

  return {
    metrics,
    config,
    isMonitoring,
    startMonitoring,
    debounce,
    throttle,
    memoize,
    lazyLoad,
    getCachedValue,
    setCachedValue,
    clearCache,
    optimizeImage,
    analyzeBundle,
    getPerformanceRecommendations,
    updateConfig,
    resetMetrics,
  };
};
