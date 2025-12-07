/**
 * 代码分割和懒加载配置
 * 优化页面加载性能
 */

import React from "react";
import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { logWarn, logError } from "@/lib/debug-logger";

// 加载组件
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="loading-spinner"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// 懒加载配置选项
const lazyOptions = {
  loading: LoadingComponent,
  ssr: false, // 禁用服务端渲染以提高性能
};

// 测试相关组件懒加载
export const LazyPartnerUnderstandingQuiz = dynamic(
  () => import("../components/PartnerUnderstandingQuiz"),
  lazyOptions,
);

export const LazyResultsDisplay = dynamic(
  () => import("../components/ResultsDisplay"),
  lazyOptions,
);

// 训练相关组件懒加载
export const LazyTrainingCampSchedule = dynamic(
  () => import("../components/TrainingCampSchedule"),
  lazyOptions,
);

// 工具组件懒加载
export const LazyLanguageSwitcher = dynamic(
  () => import("../components/LanguageSwitcher"),
  lazyOptions,
);

export const LazyRelatedLinks = dynamic(
  () => import("../components/RelatedLinks"),
  lazyOptions,
);

export const LazyViewMoreArticlesButton = dynamic(
  () => import("../components/ViewMoreArticlesButton"),
  lazyOptions,
);

// 医疗免责声明组件（轻量级，可以同步加载）
export const LazyMedicalDisclaimer = dynamic(
  () => import("../components/MedicalDisclaimer"),
  {
    loading: () => <div className="loading-skeleton h-32 rounded-lg"></div>,
    ssr: true, // 医疗免责声明需要SEO，保持服务端渲染
  },
);

// 预加载关键组件
export const preloadCriticalComponents = () => {
  // 预加载测试组件（用户最可能首先使用的）
  import("../components/PartnerUnderstandingQuiz");

  // 预加载结果展示组件
  import("../components/ResultsDisplay");
};

// 按需加载非关键组件
export const loadNonCriticalComponents = async () => {
  // 延迟加载训练计划组件
  setTimeout(() => {
    import("../components/TrainingCampSchedule");
  }, 2000);

  // 延迟加载相关链接组件
  setTimeout(() => {
    import("../components/RelatedLinks");
  }, 3000);
};

// 组件预加载Hook
export const useComponentPreloader = () => {
  const [preloadedComponents, setPreloadedComponents] = React.useState<
    Set<string>
  >(new Set());

  const preloadComponent = async (componentName: string) => {
    if (preloadedComponents.has(componentName)) return;

    try {
      switch (componentName) {
        case "quiz":
          await import("../components/PartnerUnderstandingQuiz");
          break;
        case "results":
          await import("../components/ResultsDisplay");
          break;
        case "training":
          await import("../components/TrainingCampSchedule");
          break;
        case "related":
          await import("../components/RelatedLinks");
          break;
        default:
          logWarn(
            `Unknown component: ${componentName}`,
            { componentName },
            "codeSplitting/preloadComponent",
          );
      }

      setPreloadedComponents((prev) => new Set([...prev, componentName]));
    } catch (error) {
      logError(
        `Failed to preload component ${componentName}`,
        error,
        "codeSplitting/preloadComponent",
      );
    }
  };

  return { preloadComponent, preloadedComponents };
};

// 动态导入工具函数
export const dynamicImport = async function <T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType<T>,
): Promise<ComponentType<T>> {
  try {
    const loaded = await importFn();
    return loaded.default;
  } catch (error) {
    logError("Dynamic import failed", error, "codeSplitting/dynamicImport");
    if (fallback) {
      return fallback;
    }
    throw error;
  }
};

// 组件加载状态管理
export const useComponentLoadingState = () => {
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});

  const setLoading = (componentName: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [componentName]: isLoading,
    }));
  };

  const isLoading = (componentName: string) =>
    loadingStates[componentName] || false;

  return { setLoading, isLoading };
};

type PerformanceWithMemory = Performance & {
  memory?: {
    usedJSHeapSize: number;
  };
};

// 性能监控
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = React.useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  });

  React.useEffect(() => {
    const startTime = performance.now();

    // 监控页面加载时间
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics((prev) => ({ ...prev, loadTime }));
    };

    // 监控内存使用
    const checkMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as PerformanceWithMemory).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024,
        }));
      }
    };

    window.addEventListener("load", handleLoad);
    const memoryTimer = setInterval(checkMemory, 1000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearInterval(memoryTimer);
    };
  }, []);

  return metrics;
};
