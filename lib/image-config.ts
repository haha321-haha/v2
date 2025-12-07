/**
 * 图片组件配置管理
 * 统一管理SmartImage、OptimizedImage等组件的配置
 */

import { logError, logWarn } from "@/lib/debug-logger";

export interface ImageConfig {
  useSmartImage: boolean;
  debugMode: boolean;
  fallbackComponent: "OptimizedImage" | "img";
  retryCount: number;
  timeout: number;
  enableErrorBoundary: boolean;
  enableFallback: boolean;
}

/**
 * 获取图片配置
 */
export function getImageConfig(): ImageConfig {
  return {
    useSmartImage: process.env.NEXT_PUBLIC_USE_SMART_IMAGE !== "false",
    debugMode: process.env.NEXT_PUBLIC_DEBUG_IMAGES === "true",
    fallbackComponent:
      (process.env.NEXT_PUBLIC_IMAGE_FALLBACK as "OptimizedImage" | "img") ||
      "OptimizedImage",
    retryCount: parseInt(process.env.NEXT_PUBLIC_IMAGE_RETRY_COUNT || "1"),
    timeout: parseInt(process.env.NEXT_PUBLIC_IMAGE_TIMEOUT || "10000"),
    enableErrorBoundary: true,
    enableFallback: true,
  };
}

/**
 * 图片组件选择器
 * 根据配置自动选择使用哪个图片组件
 */
export function getImageComponent() {
  const config = getImageConfig();

  if (config.useSmartImage) {
    return "SmartImage";
  } else if (config.fallbackComponent === "OptimizedImage") {
    return "OptimizedImage";
  } else {
    return "img";
  }
}

/**
 * 图片组件工厂
 * 动态创建图片组件实例
 */
export function createImageComponent(config?: Partial<ImageConfig>) {
  const finalConfig = { ...getImageConfig(), ...config };

  if (finalConfig.useSmartImage) {
    // 动态导入SmartImage
    return import("@/components/ui/SmartImage").then(
      (module) => module.default,
    );
  } else if (finalConfig.fallbackComponent === "OptimizedImage") {
    // 动态导入OptimizedImage
    return import("@/components/ui/OptimizedImage").then(
      (module) => module.default,
    );
  } else {
    // 返回原生img标签的React组件
    return Promise.resolve("img");
  }
}

/**
 * 图片错误处理
 */
export class ImageErrorHandler {
  private static errorCount = 0;
  private static maxErrors = 10;

  static handleError(error: Error, src: string, component: string) {
    this.errorCount++;

    logError(
      `图片加载错误 [${component}]: ${src}`,
      {
        error: error.message,
        src,
        count: this.errorCount,
        timestamp: new Date().toISOString(),
      },
      "image-config/ImageErrorHandler/handleError",
    );

    // 如果错误过多，建议切换到备用组件
    if (this.errorCount >= this.maxErrors) {
      logWarn(
        `图片错误过多 (${this.errorCount})，建议检查图片配置或切换到备用组件`,
        undefined,
        "image-config/ImageErrorHandler/handleError",
      );
    }
  }

  static resetErrorCount() {
    this.errorCount = 0;
  }

  static getErrorCount() {
    return this.errorCount;
  }
}

/**
 * 图片性能监控
 */
export class ImagePerformanceMonitor {
  private static loadTimes: number[] = [];
  private static maxSamples = 100;

  static recordLoadTime(loadTime: number, src: string) {
    this.loadTimes.push(loadTime);

    // 保持样本数量在限制内
    if (this.loadTimes.length > this.maxSamples) {
      this.loadTimes.shift();
    }

    // 记录慢加载
    if (loadTime > 3000) {
      logWarn(
        `图片加载缓慢: ${src} (${loadTime}ms)`,
        undefined,
        "image-config/ImagePerformanceMonitor/recordLoadTime",
      );
    }
  }

  static getAverageLoadTime(): number {
    if (this.loadTimes.length === 0) return 0;
    return (
      this.loadTimes.reduce((sum, time) => sum + time, 0) /
      this.loadTimes.length
    );
  }

  static getSlowLoadCount(): number {
    return this.loadTimes.filter((time) => time > 3000).length;
  }

  static reset() {
    this.loadTimes = [];
  }
}

/**
 * 图片组件状态管理
 */
export class ImageComponentState {
  private static state = {
    smartImageErrors: 0,
    optimizedImageErrors: 0,
    totalLoads: 0,
    lastError: null as Error | null,
    lastErrorTime: null as Date | null,
  };

  static recordError(component: "SmartImage" | "OptimizedImage", error: Error) {
    if (component === "SmartImage") {
      this.state.smartImageErrors++;
    } else {
      this.state.optimizedImageErrors++;
    }

    this.state.lastError = error;
    this.state.lastErrorTime = new Date();
  }

  static recordLoad() {
    this.state.totalLoads++;
  }

  static getState() {
    return { ...this.state };
  }

  static reset() {
    this.state = {
      smartImageErrors: 0,
      optimizedImageErrors: 0,
      totalLoads: 0,
      lastError: null,
      lastErrorTime: null,
    };
  }

  static shouldUseFallback(): boolean {
    const { smartImageErrors, totalLoads } = this.state;

    // 如果SmartImage错误率超过10%，建议使用备用组件
    if (totalLoads > 0 && smartImageErrors / totalLoads > 0.1) {
      return true;
    }

    return false;
  }
}
