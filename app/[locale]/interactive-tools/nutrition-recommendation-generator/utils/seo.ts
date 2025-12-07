/**
 * SEO优化 - 基于ziV1d3d的SEO优化
 * 提供搜索引擎优化功能
 */

import { Metadata } from "next";

// 基于ziV1d3d的SEO配置
export const seoConfig = {
  // 基础SEO信息
  base: {
    title: "Nutrition Recommendation Generator | Period Hub",
    description:
      "Professional nutrition suggestion generator based on your menstrual cycle, health goals, and Holistic Health body pattern. Combines modern nutrition science with Holistic Health principles.",
    keywords:
      "nutrition suggestion generator,menstrual cycle nutrition,Holistic Health body pattern diet,personalized nutrition plan,women's health nutrition,period nutrition management",
    author: "Period Hub",
    siteName: "Period Hub",
    url: "https://www.periodhub.health/nutrition-recommendation-generator",
  },

  // 中文SEO信息
  zh: {
    title: "营养推荐生成器 | Period Hub",
    description:
      "专业的营养推荐生成器，基于您的月经周期、健康目标和整体健康体质，提供个性化的饮食指导。科学结合现代营养学与整体健康理论。",
    keywords:
      "营养推荐生成器,月经周期营养,整体健康体质饮食,个性化营养方案,女性健康饮食,经期营养管理,痛经营养调理,整体健康食疗",
  },

  // 英文SEO信息
  en: {
    title: "Nutrition Recommendation Generator | Period Hub",
    description:
      "Professional nutrition suggestion generator based on your menstrual cycle, health goals, and Holistic Health body pattern. Combines modern nutrition science with Holistic Health principles.",
    keywords:
      "nutrition suggestion generator,menstrual cycle nutrition,Holistic Health body pattern diet,personalized nutrition plan,women's health nutrition,period nutrition management",
  },
};

// 基于ziV1d3d的Open Graph配置
export const openGraphConfig = {
  type: "website" as const,
  locale: "en_US",
  alternateLocale: "zh_CN",
  siteName: "Period Hub",
  title: "Nutrition Recommendation Generator | Period Hub",
  description:
    "Professional nutrition suggestion generator based on your menstrual cycle, health goals, and Holistic Health body pattern.",
  url: "https://www.periodhub.health/nutrition-recommendation-generator",
  images: [
    {
      url: "https://www.periodhub.health/images/logo.png",
      alt: "Nutrition Recommendation Generator",
    },
  ],
};

// 基于ziV1d3d的Twitter Card配置
export const twitterConfig = {
  card: "summary_large_image" as const,
  site: "@PeriodHub",
  creator: "@PeriodHub",
  title: "Nutrition Recommendation Generator | Period Hub",
  description:
    "Professional nutrition suggestion generator based on your menstrual cycle, health goals, and Holistic Health body pattern.",
  images: ["https://www.periodhub.health/images/logo.png"],
};

// 基于ziV1d3d的结构化数据
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Nutrition Recommendation Generator",
  description:
    "Professional nutrition suggestion generator based on your menstrual cycle, health goals, and Holistic Health body pattern.",
  url: "https://www.periodhub.health/nutrition-recommendation-generator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Period Hub",
    url: "https://www.periodhub.health",
  },
  featureList: [
    "Menstrual Phase Nutrition Guidance",
    "Health Goals Tracking",
    "Holistic Health Body Pattern Analysis",
    "Personalized Recommendations",
    "Multilingual Support",
  ],
};

// 生成SEO元数据
export function generateSEOMetadata(locale: "en" | "zh"): Metadata {
  const config = locale === "zh" ? seoConfig.zh : seoConfig.en;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: seoConfig.base.author }],
    openGraph: {
      type: openGraphConfig.type as "website",
      locale:
        locale === "zh"
          ? openGraphConfig.alternateLocale
          : openGraphConfig.locale,
      alternateLocale:
        locale === "zh"
          ? openGraphConfig.locale
          : openGraphConfig.alternateLocale,
      siteName: openGraphConfig.siteName,
      title: config.title,
      description: config.description,
      url: seoConfig.base.url,
      images: openGraphConfig.images,
    },
    twitter: {
      card: twitterConfig.card as "summary_large_image",
      site: twitterConfig.site,
      creator: twitterConfig.creator,
      title: config.title,
      description: config.description,
      images: twitterConfig.images,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: seoConfig.base.url,
      languages: {
        en: "https://www.periodhub.health/en/nutrition-recommendation-generator",
        zh: "https://www.periodhub.health/zh/nutrition-recommendation-generator",
      },
    },
  };
}

// 基于ziV1d3d的sitemap生成
export function generateSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.periodhub.health/en/nutrition-recommendation-generator</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.periodhub.health/zh/nutrition-recommendation-generator</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

// 基于ziV1d3d的robots.txt生成
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /nutrition-recommendation-generator
Allow: /en/nutrition-recommendation-generator
Allow: /zh/nutrition-recommendation-generator

Sitemap: https://www.periodhub.health/sitemap.xml`;
}
