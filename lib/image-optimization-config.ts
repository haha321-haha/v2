/**
 * 图片优化配置文件
 * 集中管理所有图片优化相关的配置
 */

export const ImageOptimizationConfig = {
  // 基础配置
  defaultQuality: 85,
  defaultPlaceholder: "empty" as const,

  // 懒加载配置
  lazyLoading: {
    threshold: 100, // 提前100px开始加载
    rootMargin: "50px",
    thresholdValue: 0.1,
  },

  // 响应式图片配置
  responsive: {
    breakpoints: {
      mobile: 640,
      tablet: 1024,
      desktop: 1280,
    },
    defaultSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },

  // 预设配置
  presets: {
    hero: {
      priority: true,
      quality: 90,
      preload: true,
      lazyThreshold: 0,
    },
    content: {
      priority: false,
      quality: 85,
      preload: false,
      lazyThreshold: 100,
    },
    thumbnail: {
      priority: false,
      quality: 75,
      preload: false,
      lazyThreshold: 50,
    },
    decorative: {
      priority: false,
      quality: 70,
      preload: false,
      lazyThreshold: 200,
    },
  },

  // 性能监控
  performance: {
    enableMetrics: true,
    reportErrors: true,
    logLoadTimes: false, // 生产环境关闭
  },

  // 错误处理
  errorHandling: {
    maxRetries: 2,
    fallbackImage: "/images/placeholder-error.webp",
    showErrorState: true,
  },
};

/**
 * 生成响应式sizes字符串
 */
export function generateResponsiveSizes(config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  custom?: string;
}) {
  if (config.custom) return config.custom;

  const mobile = config.mobile || 100;
  const tablet = config.tablet || 50;
  const desktop = config.desktop || 33;

  return `(max-width: 640px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`;
}

/**
 * 获取图片优化预设
 */
export function getImagePreset(
  type: keyof typeof ImageOptimizationConfig.presets,
) {
  return ImageOptimizationConfig.presets[type];
}

/**
 * 计算图片加载优先级
 */
export function shouldPrioritizeImage(
  isAboveFold: boolean,
  isHero: boolean,
  isCritical: boolean = false,
): boolean {
  return isAboveFold || isHero || isCritical;
}

/**
 * 生成图片预加载配置
 */
export function generatePreloadConfig(src: string, sizes?: string) {
  return {
    rel: "preload",
    as: "image",
    href: src,
    ...(sizes && { imageSizes: sizes }),
  };
}

export default ImageOptimizationConfig;
