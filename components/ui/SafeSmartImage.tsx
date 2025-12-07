"use client";

import { useState, useEffect } from "react";
import SmartImage from "./SmartImage";
import OptimizedImage from "./OptimizedImage";
import EnhancedImage from "./EnhancedImage";

interface SafeSmartImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  type?: "hero" | "content" | "thumbnail" | "decorative";
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
  // 安全机制配置
  enableFallback?: boolean;
  enableErrorBoundary?: boolean;
  fallbackComponent?: "EnhancedImage" | "OptimizedImage" | "img";
}

/**
 * 安全的SmartImage包装组件
 * 提供完整的错误处理、回滚机制和环境控制
 */
export default function SafeSmartImage({
  src,
  alt,
  width,
  height,
  className = "",
  type = "content",
  priority = false,
  sizes,
  quality,
  placeholder,
  style,
  onError,
  onLoad,
  enableFallback = true,
  enableErrorBoundary = true,
  fallbackComponent = "EnhancedImage",
}: SafeSmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // 客户端检测
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 环境变量控制
  const useSmartImage = process.env.NEXT_PUBLIC_USE_SMART_IMAGE !== "false";

  // 错误处理
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Note: SafeSmartImage error handling
    setErrorCount((prev) => prev + 1);

    if (enableErrorBoundary && errorCount >= 1) {
      setHasError(true);
    }

    onError?.(e);
  };

  // 加载成功处理
  const handleLoad = () => {
    onLoad?.();
  };

  // 决定使用哪个组件
  const shouldUseSmartImage = useSmartImage && !hasError && isClient;
  const shouldUseFallback =
    !shouldUseSmartImage || (enableFallback && hasError);

  // Debug logging removed for production

  // 回退到原生img标签
  if (shouldUseFallback && fallbackComponent === "img") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  // 回退到EnhancedImage
  if (shouldUseFallback && fallbackComponent === "EnhancedImage") {
    return (
      <EnhancedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  }

  // 回退到OptimizedImage
  if (shouldUseFallback && fallbackComponent === "OptimizedImage") {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  }

  // 使用SmartImage
  try {
    return (
      <SmartImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        type={type}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
      />
    );
  } catch (error) {
    // SmartImage rendering error

    // 捕获渲染错误，回退到EnhancedImage
    if (enableFallback) {
      return (
        <EnhancedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          sizes={sizes}
          quality={quality}
          placeholder={placeholder}
          style={style}
          onError={handleError}
          onLoad={handleLoad}
        />
      );
    }

    // 如果禁用回退，抛出错误
    throw error;
  }
}

// 导出配置工具
export const SafeSmartImageConfig = {
  // 环境变量检查
  isEnabled: () => process.env.NEXT_PUBLIC_USE_SMART_IMAGE !== "false",
  isDebugMode: () => process.env.NEXT_PUBLIC_DEBUG_IMAGES === "true",

  // 重置全局错误状态
  resetGlobalError: () => {
    // Global error state reset
  },

  // 获取当前配置
  getConfig: () => ({
    useSmartImage: process.env.NEXT_PUBLIC_USE_SMART_IMAGE !== "false",
    debugMode: process.env.NEXT_PUBLIC_DEBUG_IMAGES === "true",
    environment: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === "production",
  }),
};
