"use client";

import React, {
  Suspense,
  lazy,
  ComponentType,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingSpinner from "./LoadingSpinner";
import { logError, logInfo, logWarn } from "@/lib/debug-logger";

/**
 * P3阶段：懒加载实现
 * 为所有主要组件提供懒加载支持，优化性能
 */

// 懒加载组件接口
interface LazyComponentProps {
  fallback?: React.ReactNode;
  delay?: number;
  height?: string;
}

// 默认加载状态组件
const DefaultFallback = ({ height = "200px" }: { height?: string }) => (
  <div
    className="flex items-center justify-center p-8 bg-gray-50 rounded-lg"
    style={{ height }}
  >
    <LoadingSpinner size="lg" />
  </div>
);

// 延迟加载的Suspense包装器
const DelayedSuspense: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}> = ({ children, fallback, delay = 0 }) => {
  const [showContent, setShowContent] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowContent(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!showContent) {
    return <>{fallback}</>;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

/**
 * 创建懒加载组件
 * @param importFunc 动态导入函数
 * @param fallback 加载状态组件
 * @param delay 延迟加载时间(ms)
 */
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  delay: number = 0,
) {
  const LazyComponent = lazy(importFunc) as React.LazyExoticComponent<T>;

  return function LazyWrapper(
    props: React.ComponentProps<T> & LazyComponentProps,
  ) {
    const { height, delay: overrideDelay, ...componentProps } = props;
    const suspenseDelay = overrideDelay ?? delay;

    return (
      <DelayedSuspense
        fallback={fallback || <DefaultFallback height={height} />}
        delay={suspenseDelay}
      >
        {/* @ts-expect-error - Complex generic type inference for lazy components */}
        <LazyComponent {...componentProps} />
      </DelayedSuspense>
    );
  };
}

/**
 * 预加载组件
 * 在空闲时间预加载组件，提升用户体验
 */
export function preloadComponent(importFunc: () => Promise<unknown>) {
  const load = () => {
    importFunc().catch((error) => logError("懒加载时预加载组件失败", error));
  };

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    requestIdleCallback(load);
  } else {
    // 降级到setTimeout
    setTimeout(load, 100);
  }
}

/**
 * 页面级组件的懒加载
 * 用于大型页面的代码分割
 */
export function createLazyPage<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  _pageName: string,
) {
  void _pageName;
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="400px" />,
    100, // 页面级组件延迟100ms
  );
}

/**
 * 模块级组件的懒加载
 * 用于功能模块的代码分割
 */
export function createLazyModule<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  _moduleName: string,
) {
  void _moduleName;
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="300px" />,
    50, // 模块级组件延迟50ms
  );
}

/**
 * 工具组件级别的懒加载
 * 用于小型工具组件的代码分割
 */
export function createLazyTool<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  _toolName: string,
) {
  void _toolName;
  return createLazyComponent(
    importFunc,
    <DefaultFallback height="150px" />,
    0, // 工具组件立即加载
  );
}

/**
 * 批量预加载组件
 * 在应用启动时预加载关键组件
 */
export async function preloadCriticalComponents() {
  const criticalComponents = [
    {
      name: "SymptomAssessmentTool",
      importFunc: () => import("../../components/SymptomAssessmentTool"),
    },
    {
      name: "PainTrackerTool",
      importFunc: () => import("../../components/PainTrackerTool"),
    },
    {
      name: "ConstitutionTestTool",
      importFunc: () => import("../../components/ConstitutionTestTool"),
    },
    {
      name: "CycleTrackerTool",
      importFunc: () => import("../../components/CycleTrackerTool"),
    },
  ];

  // 使用Promise.allSettled确保即使某个组件加载失败也不影响其他组件
  const results = await Promise.allSettled(
    criticalComponents.map(async ({ name, importFunc }) => {
      try {
        await importFunc();
        logInfo(`✅ 预加载组件成功: ${name}`);
      } catch (error) {
        logWarn(`⚠️ 预加载组件失败: ${name}`, error);
      }
    }),
  );

  const successCount = results.filter(
    (result) => result.status === "fulfilled",
  ).length;
  logInfo(`📊 预加载完成: ${successCount}/${criticalComponents.length} 个组件`);
}

/**
 * 懒加载钩子
 * 用于在组件中动态加载其他组件
 */
export function useLazyComponent<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string,
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (Component || loading) return;

    setLoading(true);
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        logError(`懒加载组件失败: ${componentName}`, err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Component, importFunc, loading, componentName]);

  return { Component, loading, error };
}

/**
 * 条件懒加载钩子
 * 根据条件决定是否加载组件
 */
export function useConditionalLoading() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsVisible(true);
          setHasIntersected(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasIntersected]);

  return { isVisible, elementRef };
}

// 导出所有懒加载工具
const LazyComponentsModule = {
  createLazyComponent,
  createLazyPage,
  createLazyModule,
  createLazyTool,
  preloadComponent,
  preloadCriticalComponents,
  useLazyComponent,
  useConditionalLoading,
};

export default LazyComponentsModule;
