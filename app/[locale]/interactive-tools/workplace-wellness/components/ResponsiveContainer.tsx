/**
 * HVsLYEp职场健康助手 - 响应式容器组件
 * Day 10: 用户体验优化 - 响应式设计优化
 * 基于HVsLYEp的响应式设计原则
 */

"use client";

import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  spacing?: "none" | "sm" | "md" | "lg";
}

export default function ResponsiveContainer({
  children,
  className = "",
  maxWidth = "6xl",
  padding = "md",
  spacing = "md",
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 py-2",
    md: "px-4 py-4",
    lg: "px-6 py-6",
  };

  const spacingClasses = {
    none: "",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  };

  return (
    <div
      className={`
      mx-auto w-full
      ${maxWidthClasses[maxWidth]}
      ${paddingClasses[padding]}
      ${spacingClasses[spacing]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export function MobileOptimizedCard({
  children,
  className = "",
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`
      bg-white rounded-lg shadow-sm border border-neutral-100
      ${paddingClasses[padding]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export function TouchFriendlyButton({
  children,
  onClick,
  className = "",
  variant = "outline",
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 border-primary-600",
    outline: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    ghost: "text-neutral-700 hover:bg-neutral-100",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-md font-medium transition-colors duration-200
        touch-manipulation select-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function AdaptiveGrid({
  children,
  columns = "auto",
  gap = "md",
  className = "",
}: {
  children: ReactNode;
  columns?: "auto" | "1" | "2" | "3" | "4";
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const gridClasses = {
    auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 lg:gap-6",
    lg: "gap-4 sm:gap-6 lg:gap-8",
  };

  return (
    <div
      className={`
      grid
      ${gridClasses[columns]}
      ${gapClasses[gap]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
