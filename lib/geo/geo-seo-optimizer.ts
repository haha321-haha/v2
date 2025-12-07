/**
 * GEO SEO优化器
 * Geographic SEO Optimizer
 *
 * 根据用户地理位置优化SEO内容
 * Optimize SEO content based on user geographic location
 */

import type { GeoLocation } from "./geoip-service";

export interface GeoSEOConfig {
  location: GeoLocation;
  locale: string;
  baseUrl: string;
}

/**
 * 生成地理位置相关的SEO关键词
 * Generate location-based SEO keywords
 */
export function generateGeoKeywords(config: GeoSEOConfig): string[] {
  const { location } = config;
  const baseKeywords = [
    "period health",
    "menstrual cycle",
    "period pain relief",
  ];

  // 根据地理位置添加本地化关键词
  if (location.countryCode === "CN") {
    return [
      ...baseKeywords,
      "经期健康",
      "痛经缓解",
      "月经周期管理",
      "中国女性健康",
    ];
  }

  if (location.countryCode === "US") {
    return [
      ...baseKeywords,
      "women health",
      "period management",
      "menstrual health",
    ];
  }

  return baseKeywords;
}

/**
 * 生成地理位置相关的结构化数据
 * Generate location-based structured data
 */
export function generateGeoStructuredData(
  config: GeoSEOConfig,
): Record<string, unknown> {
  const { location, baseUrl } = config;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PeriodHub",
    address: {
      "@type": "PostalAddress",
      addressCountry: location.countryCode,
      addressLocality: location.city,
      addressRegion: location.region,
    },
    areaServed: {
      "@type": "Country",
      name: location.country,
    },
    url: baseUrl,
  };
}

/**
 * 优化元数据以包含地理位置信息
 * Optimize metadata to include geographic information
 */
export function optimizeMetadataForGeo(
  metadata: Record<string, unknown>,
  config: GeoSEOConfig,
): Record<string, unknown> {
  const geoKeywords = generateGeoKeywords(config);

  return {
    ...metadata,
    keywords: [
      ...(Array.isArray(metadata.keywords) ? metadata.keywords : []),
      ...geoKeywords,
    ].join(", "),
  };
}
