/**
 * 移动端性能优化工具
 */

import { logInfo, logError } from "@/lib/debug-logger";

// 1. 触摸优化工具
export class TouchOptimizer {
  private static instance: TouchOptimizer;

  static getInstance(): TouchOptimizer {
    if (!TouchOptimizer.instance) {
      TouchOptimizer.instance = new TouchOptimizer();
    }
    return TouchOptimizer.instance;
  }

  // 初始化触摸优化
  initTouchOptimization(): void {
    this.addTouchClasses();
    this.optimizeScrollBehavior();
    this.preventZoomOnInput();
  }

  // 为触摸目标添加CSS类
  private addTouchClasses(): void {
    const touchElements = document.querySelectorAll(
      'button, a, [role="button"]',
    );

    touchElements.forEach((element) => {
      // 检查是否已经有触摸优化类
      if (!element.classList.contains("touch-target")) {
        element.classList.add("touch-target");
      }

      // 为按钮添加特定类
      if (element.tagName === "BUTTON") {
        element.classList.add("btn-touch");
      }

      // 为链接添加特定类
      if (element.tagName === "A") {
        element.classList.add("link-touch");
      }
    });
  }

  // 优化滚动行为
  private optimizeScrollBehavior(): void {
    // 启用平滑滚动
    document.documentElement.style.scrollBehavior = "smooth";

    // 优化移动端滚动性能
    if (this.isMobile()) {
      (
        document.body.style as CSSStyleDeclaration & {
          webkitOverflowScrolling?: string;
        }
      ).webkitOverflowScrolling = "touch";
    }
  }

  // 防止输入框缩放
  private preventZoomOnInput(): void {
    if (this.isMobile()) {
      const inputs = document.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("focus", () => {
          // 设置viewport防止缩放
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute(
              "content",
              "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
            );
          }
        });

        input.addEventListener("blur", () => {
          // 恢复viewport设置
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute(
              "content",
              "width=device-width, initial-scale=1.0",
            );
          }
        });
      });
    }
  }

  // 检测移动设备
  private isMobile(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth <= 768
    );
  }
}

interface CacheItem {
  value: unknown;
  expiry: number;
}

// 2. 网络优化工具
export class NetworkOptimizer {
  private static instance: NetworkOptimizer;
  private cache: Map<string, CacheItem> = new Map();

  static getInstance(): NetworkOptimizer {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer();
    }
    return NetworkOptimizer.instance;
  }

  // 初始化网络优化
  initNetworkOptimization(): void {
    this.setupPreconnect();
    this.setupPrefetch();
    this.setupServiceWorker();
  }

  // 设置预连接
  private setupPreconnect(): void {
    const domains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://images.unsplash.com",
    ];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }

  // 设置预获取
  private setupPrefetch(): void {
    // 预获取关键页面
    const criticalPages = [
      "/zh/interactive-tools",
      "/zh/immediate-relief",
      "/zh/health-guide",
    ];

    criticalPages.forEach((page) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = page;
      document.head.appendChild(link);
    });
  }

  // 设置Service Worker
  private setupServiceWorker(): void {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logInfo(
            "Service Worker registered",
            registration,
            "NetworkOptimizer/setupServiceWorker",
          );
        })
        .catch((error) => {
          logError(
            "Service Worker registration failed:",
            error,
            "NetworkOptimizer/setupServiceWorker",
          );
        });
    }
  }

  // 缓存管理
  setCache(key: string, value: unknown, ttl: number = 300000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  getCache(key: string): unknown {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }
}

// 3. 渲染优化工具
export class RenderOptimizer {
  private static instance: RenderOptimizer;
  private observer: IntersectionObserver | null = null;

  static getInstance(): RenderOptimizer {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer();
    }
    return RenderOptimizer.instance;
  }

  // 初始化渲染优化
  initRenderOptimization(): void {
    this.setupLazyLoading();
    this.optimizeImages();
    this.setupSkeletonLoading();
  }

  // 设置懒加载
  private setupLazyLoading(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            // 懒加载图片
            if (element.tagName === "IMG") {
              const img = element as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
            }

            // 懒加载组件
            if (element.dataset.component) {
              this.loadComponent(element);
            }

            this.observer?.unobserve(element);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      },
    );

    // 观察所有需要懒加载的元素
    document.querySelectorAll("[data-lazy]").forEach((el) => {
      this.observer?.observe(el);
    });
  }

  // 优化图片
  private optimizeImages(): void {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // 添加懒加载属性
      if (!img.loading) {
        img.loading = "lazy";
      }

      // 优化图片格式
      if (this.supportsWebP()) {
        this.convertToWebP(img);
      }
    });
  }

  // 设置骨架屏加载
  private setupSkeletonLoading(): void {
    // 为加载中的元素添加骨架屏
    const loadingElements = document.querySelectorAll("[data-loading]");

    loadingElements.forEach((element) => {
      element.classList.add("loading-skeleton");

      // 模拟加载完成
      setTimeout(
        () => {
          element.classList.remove("loading-skeleton");
          element.removeAttribute("data-loading");
        },
        1000 + Math.random() * 2000,
      );
    });
  }

  // 加载组件
  private loadComponent(element: HTMLElement): void {
    const componentName = element.dataset.component;
    if (!componentName) return;

    // 动态导入组件
    import(`@/components/${componentName}`)
      .then((module) => {
        // 渲染组件
        if (module.default) {
          // 这里需要根据实际的组件渲染方式来实现
          logInfo(
            `Loaded component: ${componentName}`,
            undefined,
            "RenderOptimizer/loadComponent",
          );
        }
      })
      .catch((error) => {
        logError(
          `Failed to load component ${componentName}:`,
          error,
          "RenderOptimizer/loadComponent",
        );
      });
  }

  // 检查WebP支持
  private supportsWebP(): boolean {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }

  // 转换为WebP格式
  private convertToWebP(img: HTMLImageElement): void {
    const src = img.src;
    if (src.includes(".jpg") || src.includes(".png")) {
      img.src = src.replace(/\.(jpg|png)/, ".webp");

      // 如果WebP加载失败，回退到原格式
      img.onerror = () => {
        img.src = src;
      };
    }
  }
}

// 4. 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 初始化性能监控
  initPerformanceMonitoring(): void {
    this.measureCoreWebVitals();
    this.setupPerformanceObserver();
    this.trackUserInteractions();
  }

  // 测量核心Web指标
  private measureCoreWebVitals(): void {
    // 测量LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      logInfo(
        "LCP",
        lastEntry.startTime,
        "PerformanceMonitor/measureCoreWebVitals",
      );
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // 测量FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        this.metrics.fid = fidEntry.processingStart - entry.startTime;
        logInfo(
          "FID",
          this.metrics.fid,
          "PerformanceMonitor/measureCoreWebVitals",
        );
      });
    }).observe({ entryTypes: ["first-input"] });

    // 测量CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      });
      this.metrics.cls = clsValue;
      logInfo("CLS", clsValue, "PerformanceMonitor/measureCoreWebVitals");
    }).observe({ entryTypes: ["layout-shift"] });
  }

  // 设置性能观察器
  private setupPerformanceObserver(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.domContentLoaded =
            navEntry.domContentLoadedEventEnd -
            navEntry.domContentLoadedEventStart;
          this.metrics.loadComplete =
            navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      });
    });

    observer.observe({ entryTypes: ["navigation"] });
  }

  // 跟踪用户交互
  private trackUserInteractions(): void {
    let interactionCount = 0;

    ["click", "touchstart", "keydown"].forEach((eventType) => {
      document.addEventListener(
        eventType,
        () => {
          interactionCount++;
          this.metrics.userInteractions = interactionCount;
        },
        { passive: true },
      );
    });
  }

  // 获取性能指标
  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  // 报告性能数据
  reportPerformance(): void {
    const metrics = this.getMetrics();
    logInfo(
      "Performance Metrics",
      metrics,
      "PerformanceMonitor/reportPerformance",
    );

    // 这里可以发送数据到分析服务
    if (
      typeof window !== "undefined" &&
      (
        window as Window & {
          gtag?: (
            command: string,
            eventName: string,
            params: Record<string, unknown>,
          ) => void;
        }
      ).gtag
    ) {
      (
        window as Window & {
          gtag?: (
            command: string,
            eventName: string,
            params: Record<string, unknown>,
          ) => void;
        }
      ).gtag?.("event", "performance_metrics", {
        custom_map: metrics,
      });
    }
  }
}

// 5. 移动端优化初始化
export function initMobileOptimization(): void {
  // 初始化所有优化工具
  TouchOptimizer.getInstance().initTouchOptimization();
  NetworkOptimizer.getInstance().initNetworkOptimization();
  RenderOptimizer.getInstance().initRenderOptimization();
  PerformanceMonitor.getInstance().initPerformanceMonitoring();

  logInfo(
    "Mobile optimization initialized",
    undefined,
    "initMobileOptimization",
  );
}

// 6. 移动端检测工具
export function isMobile(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth <= 768
  );
}

// 7. 触摸事件优化
export function optimizeTouchEvents(): void {
  // 防止双击缩放
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );

  // 优化触摸滚动
  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false },
  );
}
