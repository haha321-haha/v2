"use client";

import { useState, useRef, useEffect } from "react";

interface OptimizedSVGProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
}

/**
 * 优化的SVG组件
 * 专门处理SVG图片的懒加载和性能优化
 */
export default function OptimizedSVG({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  style = {},
  onError,
  onLoad,
}: OptimizedSVGProps) {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

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
        rootMargin: "50px",
        threshold: 0.1,
      },
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // 错误处理
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Error: OptimizedSVG failed to load
    setHasError(true);
    onError?.(e);
  };

  // 加载完成处理
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
        style={{
          width: "100%",
          aspectRatio: width && height ? `${width}/${height}` : "16/9",
          ...style,
        }}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-gray-600">SVG加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={svgRef} className="relative">
      {/* 加载状态 */}
      {!isLoaded && isInView && (
        <div
          className={`absolute inset-0 ${className} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center animate-pulse`}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : "16/9",
          }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-blue-500">Loading SVG...</p>
          </div>
        </div>
      )}

      {/* 占位符 */}
      {!isInView && !priority && (
        <div
          className={`${className} bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center`}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : "16/9",
            ...style,
          }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-400">准备加载SVG...</p>
          </div>
        </div>
      )}

      {/* 实际SVG */}
      {isInView && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500 ease-in-out`}
          width={width}
          height={height}
          style={{
            maxWidth: "100%",
            height: "auto",
            ...style,
          }}
          onError={handleError}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}
