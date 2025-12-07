"use client";

import { useEffect, useState } from "react";

interface SuppressHydrationWarningProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 抑制水合警告组件
 * 用于处理浏览器翻译插件等第三方工具导致的水合不匹配
 */
export default function SuppressHydrationWarning({
  children,
  fallback = null,
}: SuppressHydrationWarningProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
