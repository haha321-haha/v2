"use client";

import { useEffect, useState } from "react";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HydrationBoundary - 处理水合错误的边界组件
 *
 * 解决豆包等浏览器扩展引起的水合错误问题
 * 通过延迟渲染避免服务器端和客户端DOM结构不匹配
 */
export default function HydrationBoundary({
  children,
  fallback = <div>Loading...</div>,
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 延迟设置水合状态，避免扩展干扰
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 服务端渲染时直接返回fallback
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  // 客户端水合完成后返回实际内容
  return <>{children}</>;
}
