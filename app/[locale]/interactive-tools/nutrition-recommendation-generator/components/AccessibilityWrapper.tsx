/**
 * 可访问性包装器 - 基于ziV1d3d的可访问性改进
 * 提供键盘导航、屏幕阅读器支持等功能
 */

"use client";

import React, { useEffect, useRef } from "react";

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export default function AccessibilityWrapper({
  children,
  role,
  ariaLabel,
  ariaDescribedBy,
  tabIndex,
  onKeyDown,
}: AccessibilityWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 基于ziV1d3d的键盘导航支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }

      // 基于ziV1d3d的键盘快捷键
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const button = ref.current?.querySelector("button");
        if (button) {
          button.click();
        }
      }

      // 基于ziV1d3d的ESC键处理
      if (event.key === "Escape") {
        const closeButton = ref.current?.querySelector("[data-close]");
        if (closeButton) {
          (closeButton as HTMLButtonElement).click();
        }
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    }
  }, [onKeyDown]);

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={tabIndex}
      className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {children}
    </div>
  );
}

// 基于ziV1d3d的屏幕阅读器支持
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// 基于ziV1d3d的焦点管理
export function FocusManager({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleTabKey);
      return () => container.removeEventListener("keydown", handleTabKey);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
    >
      {children}
    </div>
  );
}

// 基于ziV1d3d的高对比度支持
export function HighContrastWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="high-contrast">{children}</div>;
}

// 基于ziV1d3d的动画控制
export function ReducedMotionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="reduced-motion">{children}</div>;
}
