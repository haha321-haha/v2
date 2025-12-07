"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface EnhancedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
  // 懒加载配置
  lazyThreshold?: number;
  // 响应式配置
  responsive?: boolean;
  // 预加载配置
  preload?: boolean;
}

/**
 * 增强版图片组件
 * 提供高级懒加载、响应式图片和预加载功能
 */
export default function EnhancedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  quality = 85,
  placeholder = "empty",
  style = {},
  onError,
  onLoad,
  lazyThreshold = 100,
  responsive = true,
  preload = false,
}: EnhancedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(priority); // 优先图片立即显示
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: `${lazyThreshold}px`,
        threshold: 0.1,
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView, lazyThreshold]);

  // 错误处理
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Error: EnhancedImage failed to load
    setImageError(true);
    onError?.(e);
  };

  // 加载完成处理
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // 生成响应式sizes
  const responsiveSizes =
    responsive && !sizes
      ? `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
      : sizes;

  if (imageError) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
        style={{ width: "100%", aspectRatio: `${width}/${height}`, ...style }}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-600">图片加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className="relative">
      {/* 加载状态 */}
      {isLoading && isInView && (
        <div
          className={`absolute inset-0 ${className} bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center animate-pulse`}
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-xs text-purple-500">Loading...</p>
          </div>
        </div>
      )}

      {/* 占位符 */}
      {!isInView && !priority && (
        <div
          className={`${className} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center`}
          style={{ aspectRatio: `${width}/${height}`, ...style }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">🖼️</div>
            <p className="text-xs text-gray-400">准备加载...</p>
          </div>
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <>
          {/* 预加载提示 */}
          {preload && (
            <link
              rel="preload"
              as="image"
              href={src}
              imageSizes={responsiveSizes}
              imageSrcSet={`${src} ${width}w`}
            />
          )}

          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`${className} ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500 ease-in-out`}
            sizes={responsiveSizes}
            priority={priority}
            placeholder={placeholder}
            quality={quality}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "cover",
              ...style,
            }}
            onError={handleError}
            onLoad={handleLoad}
          />
        </>
      )}
    </div>
  );
}

// 导出预设配置
export const EnhancedImagePresets = {
  hero: {
    priority: true,
    quality: 90,
    responsive: true,
    preload: true,
    lazyThreshold: 0,
  },
  content: {
    priority: false,
    quality: 85,
    responsive: true,
    preload: false,
    lazyThreshold: 100,
  },
  thumbnail: {
    priority: false,
    quality: 75,
    responsive: true,
    preload: false,
    lazyThreshold: 50,
  },
  decorative: {
    priority: false,
    quality: 70,
    responsive: false,
    preload: false,
    lazyThreshold: 200,
  },
};
