"use client";

import React, { Suspense, lazy } from "react";
import SafeSmartImage from "@/components/ui/SafeSmartImage";

type PerformanceWithMemory = Performance & {
  memory?: {
    usedJSHeapSize: number;
  };
};

// 加载骨架屏组件
export const LoadingSkeleton = ({
  className = "",
  height = "h-64",
}: {
  className?: string;
  height?: string;
}) => (
  <div className={`loading-skeleton ${height} rounded-lg ${className}`}>
    <div className="animate-pulse bg-gray-200 h-full rounded-lg"></div>
  </div>
);

// 测试组件懒加载包装器
export const LazyQuizComponent = lazy(() =>
  import("../components/PartnerUnderstandingQuiz").then((module) => ({
    default: module.default,
  })),
);

// 结果展示组件懒加载包装器
export const LazyResultsComponent = lazy(() =>
  import("../components/ResultsDisplay").then((module) => ({
    default: module.default,
  })),
);

// 训练计划组件懒加载包装器
export const LazyTrainingComponent = lazy(() =>
  import("../components/TrainingCampSchedule").then((module) => ({
    default: module.default,
  })),
);

// 相关链接组件懒加载包装器
export const LazyRelatedLinksComponent = lazy(() =>
  import("../components/RelatedLinks").then((module) => ({
    default: module.default,
  })),
);

// 带加载状态的组件包装器
export const withLoadingState = <P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ReactNode,
) => {
  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={loadingComponent || <LoadingSkeleton />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

// 性能监控Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
  });

  React.useEffect(() => {
    const startTime = performance.now();

    // 监控内存使用
    const checkMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as PerformanceWithMemory).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }));
      }
    };

    const timer = setInterval(checkMemory, 1000);

    const endTime = performance.now();
    setMetrics((prev) => ({
      ...prev,
      renderTime: endTime - startTime,
    }));

    return () => {
      clearInterval(timer);
    };
  }, []);

  return metrics;
};

// 图片懒加载组件
export const LazyImage = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
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
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
      {isInView && (
        <SafeSmartImage
          src={src}
          alt={alt}
          width={400}
          height={300}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority={false}
          type="content"
        />
      )}
    </div>
  );
};

// 虚拟滚动Hook（用于长列表）
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
): {
  visibleItems: T[];
  totalHeight: number;
  offsetY: number;
  setScrollTop: React.Dispatch<React.SetStateAction<number>>;
} {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length,
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
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
  const lastRan = React.useRef<number>(Date.now());

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
