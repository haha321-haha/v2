/**
 * 生产环境配置 - 基于ziV1d3d的生产环境设置
 * 提供生产环境所需的配置和优化
 */

// 基于ziV1d3d的生产环境配置
export const productionConfig = {
  // 基于ziV1d3d的性能配置
  performance: {
    enableMonitoring: true,
    enableCaching: true,
    enableCompression: true,
    enableMinification: true,
    cacheMaxAge: 31536000, // 1年
    compressionLevel: 6,
  },

  // 基于ziV1d3d的安全配置
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableClickjackingProtection: true,
    enableReferrerPolicy: true,
    enablePermissionsPolicy: true,
  },

  // 基于ziV1d3d的SEO配置
  seo: {
    enableSitemap: true,
    enableRobots: true,
    enableMetaTags: true,
    enableOpenGraph: true,
    enableTwitterCard: true,
    enableStructuredData: true,
  },

  // 基于ziV1d3d的监控配置
  monitoring: {
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    enableUserTracking: true,
    enableConversionTracking: true,
  },

  // 基于ziV1d3d的CDN配置
  cdn: {
    enableCDN: true,
    enableImageOptimization: true,
    enableFontOptimization: true,
    enableCSSOptimization: true,
    enableJSOptimization: true,
  },
};

// 基于ziV1d3d的环境变量
export const environmentVariables = {
  NODE_ENV: process.env.NODE_ENV || "production",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "https://www.periodhub.health",
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "https://api.periodhub.health",
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || "",
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
};

// 基于ziV1d3d的部署配置
export const deploymentConfig = {
  // Vercel部署配置
  vercel: {
    framework: "nextjs",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm install",
    devCommand: "npm run dev",
  },

  // Docker部署配置
  docker: {
    baseImage: "node:18-alpine",
    workingDir: "/app",
    exposePort: 3000,
    healthCheck: "/api/health",
  },

  // 静态部署配置
  static: {
    outputDirectory: "out",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  },
};

// 基于ziV1d3d的健康检查
export const healthCheckConfig = {
  endpoint: "/api/health",
  timeout: 5000,
  interval: 30000,
  retries: 3,
  checks: ["database", "cache", "external-api", "storage"],
};
