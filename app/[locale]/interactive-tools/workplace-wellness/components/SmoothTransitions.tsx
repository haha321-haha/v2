/**
 * HVsLYEp职场健康助手 - 平滑过渡组件
 * Day 10: 用户体验优化 - 交互体验提升
 * 基于HVsLYEp的过渡动画设计
 */

"use client";

import { ReactNode, useState, useEffect } from "react";

// 淡入淡出过渡
export function FadeTransition({
  children,
  isVisible,
  duration = 300,
  className = "",
}: {
  children: ReactNode;
  isVisible: boolean;
  duration?: number;
  className?: string;
}) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-opacity duration-300 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

// 滑动过渡
export function SlideTransition({
  children,
  isVisible,
  direction = "up",
  duration = 300,
  className = "",
}: {
  children: ReactNode;
  isVisible: boolean;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
}) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  const directionClasses = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
  };

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : directionClasses[direction],
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

// 缩放过渡
export function ScaleTransition({
  children,
  isVisible,
  duration = 300,
  className = "",
}: {
  children: ReactNode;
  isVisible: boolean;
  duration?: number;
  className?: string;
}) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.95)",
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

// 页面过渡
export function PageTransition({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`transition-all duration-300 ${className}`}>{children}</div>
  );
}

// 标签页过渡
export function TabTransition({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`transition-all duration-300 ${className}`}>{children}</div>
  );
}

// 悬停效果
export function HoverEffect({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`transition-all duration-200 hover:scale-105 ${className}`}>
      {children}
    </div>
  );
}

// 点击效果
export function ClickEffect({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`transition-all duration-150 active:scale-95 ${className}`}>
      {children}
    </div>
  );
}

// 动画列表项
export function AnimatedListItem({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {children}
    </div>
  );
}

// 数字计数动画
export function CountUpAnimation({
  value,
  duration = 1000,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
}
