/**
 * Day 12: 生产环境部署配置
 * 基于HVsLYEp的生产环境需求，优化性能和安全性
 */

/**
 * 生产环境配置接口
 */
export interface ProductionConfig {
  performance: {
    enableCodeSplitting: boolean;
    enableLazyLoading: boolean;
    enablePreloading: boolean;
    enableCaching: boolean;
    enableCompression: boolean;
    enableMinification: boolean;
  };
  monitoring: {
    enableWebVitals: boolean;
    enablePerformanceMonitoring: boolean;
    enableErrorTracking: boolean;
    enableAnalytics: boolean;
    logLevel: "error" | "warn" | "info" | "debug";
  };
  security: {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableSecureCookies: boolean;
    enableXSSProtection: boolean;
  };
  optimization: {
    enableTreeShaking: boolean;
    enableBundleAnalysis: boolean;
    enableSourceMap: boolean;
    enableSWC: boolean;
    enableMinification: boolean;
  };
  deployment: {
    enableStaticGeneration: boolean;
    enableISR: boolean;
    enableEdgeRuntime: boolean;
    enableCDN: boolean;
  };
}

/**
 * 默认生产环境配置
 */
export const defaultProductionConfig: ProductionConfig = {
  performance: {
    enableCodeSplitting: true,
    enableLazyLoading: true,
    enablePreloading: true,
    enableCaching: true,
    enableCompression: true,
    enableMinification: true,
  },
  monitoring: {
    enableWebVitals: true,
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    enableAnalytics: true,
    logLevel: "error",
  },
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableSecureCookies: true,
    enableXSSProtection: true,
  },
  optimization: {
    enableTreeShaking: true,
    enableBundleAnalysis: true,
    enableSourceMap: false, // 生产环境关闭source map
    enableSWC: true,
    enableMinification: true,
  },
  deployment: {
    enableStaticGeneration: true,
    enableISR: true,
    enableEdgeRuntime: false, // 根据需要启用
    enableCDN: true,
  },
};

/**
 * 性能优化配置
 */
export const performanceConfig = {
  // 代码分割配置
  codeSplitting: {
    chunks: "all",
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all",
      },
      common: {
        name: "common",
        minChunks: 2,
        chunks: "all",
        enforce: true,
      },
    },
  },

  // 懒加载配置
  lazyLoading: {
    defaultDelay: 100,
    preloadThreshold: 0.1,
    maxConcurrent: 3,
  },

  // 缓存配置
  caching: {
    staticAssets: {
      maxAge: 31536000, // 1年
      immutable: true,
    },
    apiResponses: {
      maxAge: 3600, // 1小时
      staleWhileRevalidate: 86400, // 1天
    },
    userData: {
      maxAge: 1800, // 30分钟
      staleWhileRevalidate: 3600, // 1小时
    },
  },

  // 压缩配置
  compression: {
    gzip: true,
    brotli: true,
    minSize: 1024,
  },
};

/**
 * 监控配置
 */
export const monitoringConfig = {
  // Web Vitals阈值
  webVitals: {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100, // First Input Delay
    CLS: 0.1, // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
  },

  // 性能监控配置
  performance: {
    sampleRate: 0.1, // 10%采样率
    bufferSize: 50,
    flushInterval: 5000, // 5秒
  },

  // 错误追踪配置
  errorTracking: {
    enableSourceMap: false,
    enableUserContext: true,
    enableBreadcrumbs: true,
    maxBreadcrumbs: 50,
  },
};

/**
 * 安全配置
 */
export const securityConfig = {
  // Content Security Policy
  csp: {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https:"],
    "connect-src": ["'self'", "https:"],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
  },

  // 安全头配置
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  },
};

/**
 * 部署配置
 */
export const deploymentConfig = {
  // Next.js配置
  nextjs: {
    output: "standalone",
    experimental: {
      optimizeCss: true,
      optimizePackageImports: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  },

  // 静态生成配置
  staticGeneration: {
    revalidate: 3600, // 1小时重新验证
    fallback: "blocking",
  },

  // ISR配置
  isr: {
    revalidate: 1800, // 30分钟重新验证
    maxAge: 3600, // 1小时缓存
  },

  // CDN配置
  cdn: {
    domains: ["cdn.example.com"],
    protocol: "https",
    cacheControl: "public, max-age=31536000, immutable",
  },
};

/**
 * 环境变量配置
 */
export const environmentConfig = {
  development: {
    ...defaultProductionConfig,
    monitoring: {
      ...defaultProductionConfig.monitoring,
      logLevel: "debug" as const,
      enablePerformanceMonitoring: true,
    },
    optimization: {
      ...defaultProductionConfig.optimization,
      enableSourceMap: true,
    },
  },

  production: {
    ...defaultProductionConfig,
    monitoring: {
      ...defaultProductionConfig.monitoring,
      logLevel: "error" as const,
    },
  },

  staging: {
    ...defaultProductionConfig,
    monitoring: {
      ...defaultProductionConfig.monitoring,
      logLevel: "warn" as const,
    },
  },
};

/**
 * 获取当前环境配置
 */
export function getProductionConfig(
  env: string = process.env.NODE_ENV || "development",
): ProductionConfig {
  switch (env) {
    case "production":
      return environmentConfig.production;
    case "staging":
      return environmentConfig.staging;
    default:
      return environmentConfig.development;
  }
}

/**
 * 验证生产环境配置
 */
export function validateProductionConfig(config: ProductionConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 验证性能配置
  if (
    !config.performance.enableCodeSplitting &&
    config.performance.enableLazyLoading
  ) {
    warnings.push("启用懒加载但未启用代码分割可能影响性能");
  }

  // 验证监控配置
  if (
    config.monitoring.enablePerformanceMonitoring &&
    !config.monitoring.enableWebVitals
  ) {
    warnings.push("启用性能监控但未启用Web Vitals");
  }

  // 验证安全配置
  if (config.security.enableCSP && !config.security.enableXSSProtection) {
    warnings.push("启用CSP但未启用XSS保护");
  }

  // 验证优化配置
  if (
    config.optimization.enableSourceMap &&
    config.optimization.enableMinification
  ) {
    warnings.push("生产环境启用source map可能影响安全性");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 生产环境优化建议
 */
export function getOptimizationSuggestions(config: ProductionConfig): string[] {
  const suggestions: string[] = [];

  if (!config.performance.enableCodeSplitting) {
    suggestions.push("建议启用代码分割以提升首屏加载性能");
  }

  if (!config.performance.enableLazyLoading) {
    suggestions.push("建议启用懒加载以减少初始包大小");
  }

  if (!config.performance.enablePreloading) {
    suggestions.push("建议启用组件预加载以提升用户体验");
  }

  if (!config.monitoring.enableWebVitals) {
    suggestions.push("建议启用Web Vitals监控以追踪核心性能指标");
  }

  if (!config.security.enableCSP) {
    suggestions.push("建议启用CSP以增强安全性");
  }

  return suggestions;
}

// 导出所有配置
const productionConfigBundle = {
  defaultProductionConfig,
  performanceConfig,
  monitoringConfig,
  securityConfig,
  deploymentConfig,
  environmentConfig,
  getProductionConfig,
  validateProductionConfig,
  getOptimizationSuggestions,
};

export default productionConfigBundle;
