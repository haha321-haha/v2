/**
 * HVsLYEp职场健康助手 - 加载动画组件
 * Day 10: 用户体验优化 - 交互体验提升
 * 基于HVsLYEp的动画设计原则
 */

"use client";

import { ReactNode } from "react";

// 基础加载动画
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="32"
          strokeDashoffset="32"
          className="animate-spin"
        />
      </svg>
    </div>
  );
}

// 脉冲加载器
export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
    </div>
  );
}

// 骨架卡片
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-lg border border-neutral-100 p-4 ${className}`}
    >
      <div className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3"></div>
        <div className="h-3 bg-neutral-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// 进度加载器
export function ProgressLoader({
  progress = 0,
  className = "",
}: {
  progress?: number;
  className?: string;
}) {
  return (
    <div className={`w-full bg-neutral-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}

// 波浪加载器
export function WaveLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-6 bg-primary-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

// 加载包装器
export function LoadingWrapper({
  isLoading,
  loadingComponent,
  children,
}: {
  isLoading: boolean;
  loadingComponent: ReactNode;
  children: ReactNode;
}) {
  if (isLoading) {
    return <>{loadingComponent}</>;
  }
  return <>{children}</>;
}

// 懒加载包装器
export function LazyLoadWrapper({
  children,
  fallback = <SkeletonCard />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!children) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
