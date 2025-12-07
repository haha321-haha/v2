"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 客户端包装组件，用于动态导入 Breadcrumb
const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"), {
  ssr: false,
  loading: () => <div className="mb-6 h-6" />, // 加载占位符
});

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbWrapperProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbWrapper({
  items,
  className,
}: BreadcrumbWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 在客户端挂载之前不渲染，避免 hydration 错误
  if (!isMounted) {
    return <div className="mb-6 h-6" />;
  }

  return <Breadcrumb items={items} className={className} />;
}
