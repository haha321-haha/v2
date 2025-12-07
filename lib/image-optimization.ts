/**
 * 🖼️ PeriodHub 图片优化配置
 *
 * 统一的图片优化配置和工具函数
 */

import { logError } from "@/lib/debug-logger";

interface WindowWithGtag extends Window {
  gtag?: (
    command: string,
    eventName: string,
    params?: Record<string, unknown>,
  ) => void;
}

export interface ImageOptimizationConfig {
  quality: number;
  formats: string[];
  sizes: number[];
  placeholder: "blur" | "empty";
  priority: boolean;
}

// 默认优化配置
export const defaultImageConfig: ImageOptimizationConfig = {
  quality: 85,
  formats: ["image/webp", "image/avif"],
  sizes: [320, 640, 768, 1024, 1280, 1920],
  placeholder: "blur",
  priority: false,
};

// 响应式图片尺寸配置
export const responsiveImageSizes = {
  mobile: [320, 640],
  tablet: [768, 1024],
  desktop: [1280, 1920, 2560],
};

// 图片质量配置
export const imageQualities = {
  hero: 95, // 主要图片高质量
  content: 85, // 内容图片中等质量
  thumbnail: 75, // 缩略图低质量
  decorative: 70, // 装饰性图片最低质量
};

// 根据图片用途获取优化配置
export function getImageConfig(
  type: "hero" | "content" | "thumbnail" | "decorative",
): ImageOptimizationConfig {
  const baseConfig = { ...defaultImageConfig };

  switch (type) {
    case "hero":
      return {
        ...baseConfig,
        quality: imageQualities.hero,
        priority: true,
        placeholder: "blur",
      };

    case "content":
      return {
        ...baseConfig,
        quality: imageQualities.content,
        priority: false,
        placeholder: "blur",
      };

    case "thumbnail":
      return {
        ...baseConfig,
        quality: imageQualities.thumbnail,
        priority: false,
        placeholder: "empty",
      };

    case "decorative":
      return {
        ...baseConfig,
        quality: imageQualities.decorative,
        priority: false,
        placeholder: "empty",
      };

    default:
      return baseConfig;
  }
}

// 生成响应式sizes属性
export function generateSizesString(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const sizes = [];

  if (breakpoints.mobile) {
    sizes.push(`(max-width: 768px) ${breakpoints.mobile}px`);
  }

  if (breakpoints.tablet) {
    sizes.push(`(max-width: 1024px) ${breakpoints.tablet}px`);
  }

  if (breakpoints.desktop) {
    sizes.push(`${breakpoints.desktop}px`);
  }

  return sizes.join(", ");
}

// 生成优化的图片路径
export function getOptimizedImagePath(
  originalPath: string,
  format: "webp" | "avif" = "webp",
  size?: number,
): string {
  const pathParts = originalPath.split("/");
  const fileName = pathParts.pop() || "";
  const nameWithoutExt = fileName.split(".")[0];

  if (size) {
    return `${pathParts.join(
      "/",
    )}/optimized/${format}/${nameWithoutExt}-${size}w.${format}`;
  }

  return `${pathParts.join(
    "/",
  )}/optimized/${format}/${nameWithoutExt}.${format}`;
}

// 检查图片是否需要优化
export function shouldOptimizeImage(imagePath: string): boolean {
  const ext = imagePath.split(".").pop()?.toLowerCase();
  return ext === "jpg" || ext === "jpeg" || ext === "png";
}

// 生成模糊占位符
export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f3f4f6");
    gradient.addColorStop(1, "#e5e7eb");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL("image/jpeg", 0.1);
}

// 图片加载性能监控
export function trackImageLoadPerformance(imageSrc: string, loadTime: number) {
  if (typeof window !== "undefined") {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag("event", "image_load_performance", {
        image_src: imageSrc,
        load_time: loadTime,
        performance_rating:
          loadTime < 1000 ? "fast" : loadTime < 3000 ? "medium" : "slow",
      });
    }
  }
}

// 预加载关键图片
export function preloadCriticalImages(imageUrls: string[]) {
  if (typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}

// 图片错误处理
export function handleImageError(error: Error, imageSrc: string) {
  logError(
    `图片加载失败: ${imageSrc}`,
    error,
    "image-optimization/handleImageError",
  );

  // 发送错误报告
  if (typeof window !== "undefined") {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag("event", "image_load_error", {
        image_src: imageSrc,
        error_message: error.message,
      });
    }
  }
}

// 图片优化建议
export function getImageOptimizationTips(
  currentSize: number,
  recommendedSize: number,
) {
  const tips = [];

  if (currentSize > recommendedSize * 2) {
    tips.push("图片文件过大，建议压缩");
  }

  if (currentSize < recommendedSize * 0.5) {
    tips.push("图片质量可能过低，建议提高质量");
  }

  return tips;
}

// 导出所有配置
export const imageOptimization = {
  configs: {
    default: defaultImageConfig,
    hero: getImageConfig("hero"),
    content: getImageConfig("content"),
    thumbnail: getImageConfig("thumbnail"),
    decorative: getImageConfig("decorative"),
  },
  utilities: {
    generateSizesString,
    getOptimizedImagePath,
    shouldOptimizeImage,
    generateBlurDataURL,
    trackImageLoadPerformance,
    preloadCriticalImages,
    handleImageError,
    getImageOptimizationTips,
  },
};
