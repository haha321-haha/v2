"use client";

import Image from "next/image";
import { useState } from "react";
import { imageOptimization } from "@/lib/image-optimization";
import { logError } from "@/lib/debug-logger";

interface SmartImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  type?: "hero" | "content" | "thumbnail" | "decorative";
  sizes?: string;
  priority?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: () => void;
}

/**
 * 智能图片组件
 * 自动选择最佳图片格式和尺寸
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = "",
  type = "content",
  sizes,
  priority = false,
  onError,
  onLoad,
}: SmartImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 获取优化配置
  const config = imageOptimization.configs[type];

  // 生成响应式sizes
  const responsiveSizes =
    sizes ||
    imageOptimization.utilities.generateSizesString({
      mobile: Math.min(width, 400),
      tablet: Math.min(width, 800),
      desktop: width,
    });

  if (imageError) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center`}
        style={{ width: "100%", aspectRatio: `${width}/${height}` }}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-neutral-600">图片加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 ${className} bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center animate-pulse`}
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-xs text-neutral-500">Loading...</p>
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
        sizes={responsiveSizes}
        priority={priority || config.priority}
        placeholder="empty"
        quality={config.quality}
        style={{
          maxWidth: "100%",
          height: "auto",
          objectFit: "cover",
        }}
        onError={(e) => {
          logError(`图片加载失败: ${src}`, { src }, "SmartImage");
          setImageError(true);
          const error = new Error(`图片加载失败: ${src}`);
          imageOptimization.utilities.handleImageError(error, src);
          onError?.(e);
        }}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
    </div>
  );
}
