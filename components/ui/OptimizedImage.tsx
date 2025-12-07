"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
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
}

/**
 * 优化的图片组件 - 备用组件
 * 提供基础的图片优化功能，作为SmartImage的备用方案
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  quality = 75,
  placeholder = "empty",
  style = {},
  onError,
  onLoad,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 错误处理
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Error: OptimizedImage failed to load
    setImageError(true);
    onError?.(e);
  };

  // 加载完成处理
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

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
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 ${className} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center animate-pulse`}
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-xs text-gray-500">Loading...</p>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        sizes={sizes}
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
    </div>
  );
}
