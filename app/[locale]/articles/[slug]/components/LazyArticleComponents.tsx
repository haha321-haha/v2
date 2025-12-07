/**
 * 文章页面懒加载组件配置
 * 优化文章页面的代码分割和加载性能
 */

import dynamic from "next/dynamic";
import { useState } from "react";

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

const SkeletonLoader = ({ height = "h-32" }: { height?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${height}`}></div>
);

// 懒加载配置
const lazyOptions = {
  loading: () => <LoadingSpinner />,
  ssr: false, // 禁用服务端渲染以提高性能
};

// 文章相关组件懒加载
export const LazyArticleInteractions = dynamic(
  () => import("@/components/ArticleInteractions"),
  {
    ...lazyOptions,
    loading: () => <SkeletonLoader height="h-16" />,
  },
);

export const LazyReadingProgress = dynamic(
  () => import("@/components/ReadingProgress"),
  {
    ...lazyOptions,
    loading: () => null, // 静默加载
  },
);

export const LazyTableOfContents = dynamic(
  () => import("@/components/TableOfContents"),
  {
    ...lazyOptions,
    loading: () => <SkeletonLoader height="h-48" />,
  },
);

export const LazyMarkdownWithMermaid = dynamic(
  () => import("@/components/MarkdownWithMermaid"),
  {
    ...lazyOptions,
    loading: () => <SkeletonLoader height="h-32" />,
  },
);

export const LazyStructuredData = dynamic(
  () => import("@/components/StructuredData"),
  {
    ...lazyOptions,
    loading: () => null, // 静默加载
  },
);

// NSAID相关组件懒加载
export const LazyNSAIDInteractive = dynamic(
  () => import("@/components/NSAIDInteractive"),
  {
    ...lazyOptions,
    loading: () => <SkeletonLoader height="h-32" />,
  },
);

export const LazyNSAIDContentSimple = dynamic(
  () => import("@/components/NSAIDContentSimple"),
  {
    ...lazyOptions,
    loading: () => <SkeletonLoader height="h-24" />,
  },
);

// 图标组件懒加载
export const LazyHomeIcon = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Home })),
  {
    ...lazyOptions,
    loading: () => (
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
    ),
  },
);

// 工具函数：预加载组件
export const preloadArticleComponents = () => {
  // 预加载关键组件
  import("@/components/ReadingProgress");
  import("@/components/ArticleInteractions");
};

// 工具函数：条件加载组件
export const useConditionalArticleLoading = (showComponents: boolean) => {
  if (!showComponents) {
    return {
      ArticleInteractions: null,
      TableOfContents: null,
      MarkdownWithMermaid: null,
    };
  }

  return {
    ArticleInteractions: LazyArticleInteractions,
    TableOfContents: LazyTableOfContents,
    MarkdownWithMermaid: LazyMarkdownWithMermaid,
  };
};

// 组件加载状态管理
export const useArticleComponentLoadingState = () => {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(
    new Set(),
  );

  const markComponentLoaded = (componentName: string) => {
    setLoadedComponents((prev) => new Set([...prev, componentName]));
  };

  const isComponentLoaded = (componentName: string) => {
    return loadedComponents.has(componentName);
  };

  return { markComponentLoaded, isComponentLoaded, loadedComponents };
};
