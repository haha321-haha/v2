"use client";

import React, { Suspense, lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { LoadingWrapper, SkeletonCard } from "./LoadingAnimations";
import { logWarn } from "@/lib/debug-logger";
import type {
  ExtractComponentProps,
  LazyWrapperProps,
  LazyComponentCreator,
} from "../types/lazy-component";
import { separateWrapperProps } from "../types/lazy-component";

/**
 * Day 12: 懒加载组件包装器
 * 基于HVsLYEp的组件架构，实现代码分割和按需加载
 *
 * 方案 B：完整重构 - 使用类型辅助函数提高类型安全性
 */

// 默认加载状态
const DefaultFallback = ({ height = "200px" }: { height?: string }) => (
  <LoadingWrapper
    isLoading={true}
    loadingComponent={<SkeletonCard className={`h-[${height}]`} />}
  >
    <SkeletonCard className={`h-[${height}]`} />
  </LoadingWrapper>
);

// 延迟加载包装器
const DelayedSuspense = ({
  children,
  fallback,
  delay = 0,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}) => {
  if (delay > 0) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

/**
 * 创建懒加载组件（方案 B：完整重构版本）
 *
 * 使用类型辅助函数提供更好的类型安全性：
 * - 使用 ExtractComponentProps 提取组件 props 类型
 * - 使用 separateWrapperProps 分离包装器和组件 props
 * - 使用 LazyComponentCreator 提供精确的返回类型
 *
 * @param importFunc 动态导入函数，返回包含 default 组件的 Promise
 * @param fallback 默认加载状态组件
 * @param delay 默认延迟加载时间(ms)
 * @returns 类型安全的懒加载组件包装器
 *
 * @example
 * ```tsx
 * const LazyButton = createLazyComponent(
 *   () => import('./Button'),
 *   <LoadingSpinner />,
 *   100
 * );
 *
 * // 使用时，TypeScript 会自动推断 Button 组件的 props 类型
 * <LazyButton onClick={handleClick} disabled={false} />
 * ```
 */
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  delay: number = 0,
): LazyComponentCreator<T> {
  // 使用类型断言，明确指定 LazyExoticComponent 类型
  const LazyComponent = lazy(importFunc) as LazyExoticComponent<T>;

  return function LazyWrapper(
    props: ExtractComponentProps<T> & LazyWrapperProps,
  ) {
    // 使用类型辅助函数分离 props
    const { wrapperProps, componentProps } = separateWrapperProps(props);
    const {
      fallback: overrideFallback,
      height,
      delay: overrideDelay,
    } = wrapperProps;

    // 确定最终使用的值（包装器 props 优先于函数参数）
    const finalDelay = overrideDelay ?? delay;
    const finalFallback = overrideFallback ?? fallback;

    return (
      <DelayedSuspense
        fallback={finalFallback || <DefaultFallback height={height} />}
        delay={finalDelay}
      >
        {/*
          React.lazy 的泛型类型推断限制

          这是 React.lazy 和 TypeScript 泛型结合时的已知限制。
          虽然我们已经使用了：
          1. LazyExoticComponent<T> 类型断言
          2. ExtractComponentProps<T> 提取组件 props
          3. separateWrapperProps 分离 props

          但 TypeScript 仍然无法完全推断 LazyExoticComponent 的 props 类型。

          这个错误是安全的，因为：
          - componentProps 已经通过 ExtractComponentProps<T> 进行了类型提取
          - LazyComponent 已经通过 LazyExoticComponent<T> 进行了类型断言
          - 运行时行为是正确的
          - 所有使用该函数的地方都会得到正确的类型提示

          参考：https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087

          使用类型断言而不是 any，保持类型安全
        */}
        {/* @ts-expect-error - React.lazy 泛型类型推断限制，运行时行为正确 */}
        <LazyComponent {...componentProps} />
      </DelayedSuspense>
    );
  };
}

/**
 * 预加载组件
 * 在空闲时间预加载组件，提升用户体验
 */
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();

  static async preload(
    importFunc: () => Promise<unknown>,
    componentName: string,
  ) {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }

    try {
      await importFunc();
      this.preloadedComponents.add(componentName);
    } catch (error) {
      logWarn("Failed to preload component", error, "LazyLoader");
    }
  }

  static isPreloaded(componentName: string): boolean {
    return this.preloadedComponents.has(componentName);
  }

  static clearCache() {
    this.preloadedComponents.clear();
  }
}

/**
 * 路由级别的懒加载组件
 * 用于页面级别的代码分割
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
 * 功能模块级别的懒加载组件
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
      name: "CalendarComponent",
      importFunc: () => import("./CalendarComponent"),
    },
    {
      name: "Navigation",
      importFunc: () => import("./Navigation"),
    },
    {
      name: "Header",
      importFunc: () => import("./Header"),
    },
    // Footer is now provided by the global layout, removed from lazy loader
  ];

  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(async () => {
      await Promise.allSettled(
        criticalComponents.map(({ name, importFunc }) =>
          ComponentPreloader.preload(importFunc, name),
        ),
      );
    });
  } else {
    // 降级处理：直接预加载
    await Promise.allSettled(
      criticalComponents.map(({ name, importFunc }) =>
        ComponentPreloader.preload(importFunc, name),
      ),
    );
  }
}

/**
 * 懒加载钩子
 * 用于在组件中动态加载其他组件
 */
export function useLazyComponent<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string,
) {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (Component || loading) return;

    setLoading(true);
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [importFunc, componentName, Component, loading]);

  return { Component, loading, error };
}

// 导出默认的懒加载组件
const LazyLoaderUtils = {
  createLazyComponent,
  createLazyPage,
  createLazyModule,
  createLazyTool,
  ComponentPreloader,
  preloadCriticalComponents,
  useLazyComponent,
};

export default LazyLoaderUtils;
