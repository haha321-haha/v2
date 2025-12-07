/**
 * 懒加载组件类型定义
 * 提供类型安全的懒加载组件创建工具
 */

import type { ComponentType, LazyExoticComponent } from "react";

/**
 * 提取组件 Props 类型
 * 从 ComponentType 中提取组件的 props 类型
 *
 * 支持多种组件类型：
 * - FunctionComponent
 * - ClassComponent
 * - MemoExoticComponent
 * - LazyExoticComponent
 */
export type ExtractComponentProps<T> = T extends ComponentType<infer P>
  ? P extends object
    ? P
    : Record<string, never>
  : Record<string, never>;

/**
 * Lazy 组件包装器 Props
 * 这些 props 会被传递给包装器，而不是懒加载的组件
 */
export interface LazyWrapperProps {
  /** 自定义加载状态组件 */
  fallback?: React.ReactNode;
  /** 加载状态组件的高度 */
  height?: string;
  /** 延迟加载时间（毫秒） */
  delay?: number;
}

/**
 * 类型安全的 Lazy 组件创建器
 * 返回一个接受组件 props 和包装器 props 的函数组件
 */
export type LazyComponentCreator<T extends ComponentType<unknown>> = (
  props: ExtractComponentProps<T> & LazyWrapperProps,
) => JSX.Element;

/**
 * 类型守卫：检查是否为 LazyExoticComponent
 * @param component 要检查的组件
 * @returns 是否为 LazyExoticComponent
 */
export function isLazyComponent<T extends ComponentType<unknown>>(
  component: unknown,
): component is LazyExoticComponent<T> {
  return (
    typeof component === "object" &&
    component !== null &&
    "$$typeof" in component &&
    (component as { $$typeof?: symbol }).$$typeof === Symbol.for("react.lazy")
  );
}

/**
 * 分离包装器 Props 和组件 Props
 * 从合并的 props 中分离出包装器专用的 props
 *
 * @param props 合并的 props（组件 props + 包装器 props）
 * @returns 分离后的包装器 props 和组件 props
 */
export function separateWrapperProps<T extends ComponentType<unknown>>(
  props: ExtractComponentProps<T> & LazyWrapperProps,
): {
  wrapperProps: LazyWrapperProps;
  componentProps: ExtractComponentProps<T>;
} {
  const { fallback, height, delay, ...componentProps } = props;
  return {
    wrapperProps: { fallback, height, delay },
    // 确保 componentProps 是对象类型，避免类型推断问题
    // 使用类型断言，因为我们已经通过 ExtractComponentProps<T> 确保了类型安全
    componentProps: componentProps as Record<
      string,
      unknown
    > as ExtractComponentProps<T>,
  };
}
