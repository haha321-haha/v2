"use client";

import React from "react";
import { logWarn, logError, logInfo } from "@/lib/debug-logger";

interface HydrationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Hydration错误边界组件
 * 专门处理hydration不匹配错误
 */
class InternalHydrationErrorBoundary extends React.Component<
  HydrationErrorBoundaryProps,
  HydrationErrorBoundaryState
> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    // 检查是否是hydration错误
    const isHydrationError =
      error.message.includes("hydration") ||
      error.message.includes("Hydration") ||
      error.message.includes("server rendered HTML") ||
      error.message.includes("client properties");

    if (isHydrationError) {
      logWarn(
        "[HydrationErrorBoundary] 捕获到hydration错误:",
        error,
        "HydrationErrorBoundary/getDerivedStateFromError",
      );
      return { hasError: true, error };
    }

    // 对于非hydration错误，重新抛出
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录hydration错误
    logError(
      "[HydrationErrorBoundary] Hydration错误详情:",
      {
        error: error.message,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      },
      "HydrationErrorBoundary/componentDidCatch",
    );

    // 尝试修复hydration问题
    this.fixHydrationIssues();
  }

  private fixHydrationIssues() {
    // 移除可能由浏览器扩展添加的类名
    const htmlElement = document.documentElement;
    const extensionClasses = [
      "tongyi-design-pc",
      "tongyi-design-mobile",
      "alibaba-design",
      "taobao-design",
    ];

    extensionClasses.forEach((className) => {
      if (htmlElement.classList.contains(className)) {
        htmlElement.classList.remove(className);
        logInfo(
          `[HydrationErrorBoundary] 移除了扩展类名: ${className}`,
          { className },
          "HydrationErrorBoundary/fixHydrationIssues",
        );
      }
    });

    // 强制重新渲染
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      // 显示fallback UI或重新渲染
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                页面正在加载...
              </h2>
              <p className="text-gray-600">正在修复页面渲染问题，请稍候</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// 导出的函数组件包装器
export default function HydrationErrorBoundary(
  props: HydrationErrorBoundaryProps,
) {
  return <InternalHydrationErrorBoundary {...props} />;
}
