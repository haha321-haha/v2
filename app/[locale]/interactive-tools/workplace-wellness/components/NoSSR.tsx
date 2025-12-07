"use client";

import { useEffect, useState } from "react";

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * NoSSR组件 - 确保子组件只在客户端渲染
 * 用于避免服务器端渲染与客户端状态不一致的问题
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback as React.ReactElement;
  }

  return children as React.ReactElement;
}
