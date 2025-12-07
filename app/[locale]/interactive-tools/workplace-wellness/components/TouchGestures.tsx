/**
 * HVsLYEp职场健康助手 - 触控手势组件
 * Day 10: 用户体验优化 - 响应式设计优化
 * 基于HVsLYEp的触控手势设计
 */

"use client";

import { ReactNode, useRef, useState, TouchEvent } from "react";

// 手势方向
type SwipeDirection = "up" | "down" | "left" | "right";

// 触控手势检测器
export function TouchGestureDetector({
  children,
  onSwipe,
  onTap,
  onLongPress,
  onDoubleTap,
  className = "",
}: {
  children: ReactNode;
  onSwipe?: (direction: SwipeDirection, distance: number) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    });

    // 长按检测
    if (onLongPress) {
      const longPressTimer = setTimeout(() => {
        onLongPress({ x: touch.clientX, y: touch.clientY });
      }, 500);

      const handleTouchEnd = () => {
        clearTimeout(longPressTimer);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchend", handleTouchEnd);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 双击检测
    const now = Date.now();
    if (now - lastTap < 300 && distance < 10) {
      onDoubleTap?.({ x: touch.clientX, y: touch.clientY });
      setLastTap(0);
      return;
    }

    // 滑动检测
    if (distance > 30 && deltaTime < 300) {
      let direction: SwipeDirection;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
      } else {
        direction = deltaY > 0 ? "down" : "up";
      }
      onSwipe?.(direction, distance);
    } else if (distance < 10 && deltaTime < 300) {
      // 单击检测
      onTap?.({ x: touch.clientX, y: touch.clientY });
      setLastTap(now);
    }

    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className={`touch-manipulation ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// 可滑动容器
export function SwipeableContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = "",
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}) {
  const handleSwipe = (direction: SwipeDirection, distance: number) => {
    if (distance < 50) return; // 最小滑动距离

    switch (direction) {
      case "left":
        onSwipeLeft?.();
        break;
      case "right":
        onSwipeRight?.();
        break;
      case "up":
        onSwipeUp?.();
        break;
      case "down":
        onSwipeDown?.();
        break;
    }
  };

  return (
    <TouchGestureDetector onSwipe={handleSwipe} className={className}>
      {children}
    </TouchGestureDetector>
  );
}

// 可拖拽容器
export function DraggableContainer({
  children,
  onDrag,
  onDragEnd,
  className = "",
}: {
  children: ReactNode;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragEnd?: (deltaX: number, deltaY: number) => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !startPos) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    onDrag?.(deltaX, deltaY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging || !startPos) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;

    onDragEnd?.(deltaX, deltaY);
    setIsDragging(false);
    setStartPos(null);
  };

  return (
    <div
      className={`touch-manipulation ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// 触控滚动容器
export function TouchScrollContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-auto touch-pan-y ${className}`}>{children}</div>
  );
}

// 触控反馈组件
export function TouchFeedback({
  children,
  onPress,
  className = "",
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    onPress?.();
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onPress?.();
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={`touch-manipulation select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isPressed ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}
