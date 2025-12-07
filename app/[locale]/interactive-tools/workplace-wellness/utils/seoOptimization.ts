/**
 * HVsLYEp职场健康助手 - SEO优化工具
 * 实现Meta信息优化和结构化数据生成
 */

import type { Metadata } from "next";
import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";

export type StructuredDataBlock = Record<string, unknown>;

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  structuredData?: StructuredDataBlock[];
}

export interface PageSEOData {
  zh: SEOConfig;
  en: SEOConfig;
}

/**
 * 生成页面级Meta信息
 */
export function generatePageMetadata(
  locale: Locale,
  pageData: PageSEOData,
  additionalMeta?: Partial<Metadata>,
): Metadata {
  const config = pageData[locale];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.canonical,
      languages: {
        "zh-CN": pageData.zh.canonical,
        "en-US": pageData.en.canonical,
        "x-default": pageData.en.canonical, // ✅ 修复：默认英文版本（北美市场优先）
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    ...additionalMeta,
  };
}

/**
 * 生成HVsLYEp职场健康助手的SEO数据
 */
export function getWorkplaceWellnessSEOData(): PageSEOData {
  return {
    zh: {
      title: "职场健康助手 - 经期管理与工作优化 | Period Hub",
      description:
        "专业的职场健康管理工具，提供经期跟踪、疼痛管理、营养建议和工作调整方案。支持中英双语，保护隐私，提升工作效率。",
      keywords: [
        "职场健康",
        "经期管理",
        "疼痛跟踪",
        "营养建议",
        "工作优化",
        "请假模板",
        "数据导出",
        "隐私保护",
        "女性健康",
        "职场女性",
      ],
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/zh/workplace-wellness`,
      ogImage: "/images/workplace-wellness-og-zh.jpg",
    },
    en: {
      title:
        "Workplace Wellness Assistant - Period Management & Work Optimization | Period Hub",
      description:
        "Professional workplace wellness management tool providing period tracking, pain management, nutrition advice, and work adjustment solutions. Bilingual support, privacy protection, enhanced work efficiency.",
      keywords: [
        "workplace wellness",
        "period management",
        "pain tracking",
        "nutrition advice",
        "work optimization",
        "leave templates",
        "data export",
        "privacy protection",
        "women health",
        "workplace women",
      ],
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/en/workplace-wellness`,
      ogImage: "/images/workplace-wellness-og-en.jpg",
    },
  };
}

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(t: TFunction): StructuredDataBlock {
  const faqs = [
    { key: "q1" },
    { key: "q2" },
    { key: "q3" },
    { key: "q4" },
    { key: "q5" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: t(`faq.${faq.key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${faq.key}.answer`),
      },
    })),
  };
}

/**
 * 生成工具应用Schema
 */
export function generateWebApplicationSchema(
  locale: Locale,
  t: TFunction,
): StructuredDataBlock {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structuredData.webApplication.name"),
    description: t("structuredData.webApplication.description"),
    applicationCategory: t("structuredData.webApplication.applicationCategory"),
    operatingSystem: t("structuredData.webApplication.operatingSystem"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `${baseUrl}/${locale}/interactive-tools/workplace-wellness`,
    author: {
      "@type": "Organization",
      name: "Period Hub",
      url: baseUrl,
    },
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    browserRequirements: t("structuredData.webApplication.browserRequirements"),
    softwareVersion: t("structuredData.webApplication.softwareVersion"),
    datePublished: "2024-01-01",
    dateModified:
      typeof window !== "undefined"
        ? new Date().toISOString().split("T")[0]
        : new Date(Date.now()).toISOString().split("T")[0], // SSR 安全
  };
}

/**
 * 生成面包屑导航结构化数据
 */
export function generateBreadcrumbSchema(
  locale: Locale,
  t: TFunction,
): StructuredDataBlock {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const breadcrumbs = [
    {
      name: t("structuredData.breadcrumb.home"),
      url: `${baseUrl}/${locale}`,
    },
    {
      name: t("structuredData.breadcrumb.interactiveTools"),
      url: `${baseUrl}/${locale}/interactive-tools`,
    },
    {
      name: t("structuredData.breadcrumb.workplaceWellness"),
      url: `${baseUrl}/${locale}/interactive-tools/workplace-wellness`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(
  locale: Locale,
  t: TFunction,
): StructuredDataBlock[] {
  return [
    generateFAQStructuredData(t),
    generateWebApplicationSchema(locale, t),
    generateBreadcrumbSchema(locale, t),
  ];
}

/**
 * 验证Meta信息长度
 */
export function validateMetaLength(
  title: string,
  description: string,
  locale: Locale,
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 标题长度验证
  if (locale === "zh") {
    if (title.length < 20) issues.push("中文标题过短，建议20-30字符");
    if (title.length > 60) issues.push("中文标题过长，建议不超过60字符");
  } else {
    if (title.length < 30) issues.push("英文标题过短，建议30-60字符");
    if (title.length > 60) issues.push("英文标题过长，建议不超过60字符");
  }

  // 描述长度验证
  if (locale === "zh") {
    if (description.length < 80) issues.push("中文描述过短，建议80-120字符");
    if (description.length > 160)
      issues.push("中文描述过长，建议不超过160字符");
  } else {
    if (description.length < 120) issues.push("英文描述过短，建议120-160字符");
    if (description.length > 160)
      issues.push("英文描述过长，建议不超过160字符");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 生成SEO报告
 */
export function generateSEOReport(
  locale: Locale,
  pageData: PageSEOData,
): string {
  const config = pageData[locale];
  const validation = validateMetaLength(
    config.title,
    config.description,
    locale,
  );

  const report = {
    page: "workplace-wellness",
    locale,
    title: config.title,
    titleLength: config.title.length,
    description: config.description,
    descriptionLength: config.description.length,
    keywords: config.keywords,
    keywordsCount: config.keywords.length,
    canonical: config.canonical,
    validation,
    structuredData: {
      faq: true,
      webApplication: true,
      breadcrumb: true,
    },
    generatedAt:
      typeof window !== "undefined"
        ? new Date().toISOString()
        : new Date(Date.now()).toISOString(), // SSR 安全
  };

  return JSON.stringify(report, null, 2);
}
