"use client";

import { useSmartPreload } from "@/hooks/useSmartPreload";
import { ReactNode } from "react";
import { logInfo } from "@/lib/debug-logger";

interface SmartPreloadProviderProps {
  children: ReactNode;
}

/**
 * 智能预加载提供者组件
 * 在页面级别管理webpack.js的智能预加载
 */
export function SmartPreloadProvider({ children }: SmartPreloadProviderProps) {
  // 使用智能预加载Hook
  const { isWebpackPreloaded } = useSmartPreload();

  // 在开发环境显示预加载状态（可选）
  if (process.env.NODE_ENV === "development") {
    logInfo(
      "🔍 SmartPreloadProvider: webpack preloaded =",
      { isWebpackPreloaded },
      "SmartPreloadProvider",
    );
  }

  return <>{children}</>;
}

/**
 * 页面级别的智能预加载组件
 * 用于需要特殊预加载处理的页面
 */
export function PageSmartPreload({ children }: SmartPreloadProviderProps) {
  useSmartPreload();
  return <>{children}</>;
}
