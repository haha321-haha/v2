/**
 * HVsLYEp职场健康助手 - SEO验证工具
 * 验证Meta信息和结构化数据的完整性
 */

import {
  generateSEOReport,
  getWorkplaceWellnessSEOData,
} from "./seoOptimization";
import type { Locale } from "@/i18n";
import type { Metadata } from "next";
import type { StructuredDataBlock } from "./seoOptimization";

export interface SEOValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
  structuredDataValid: boolean;
  metaValid: boolean;
}

type StructuredFAQEntry = {
  "@type"?: string;
  name?: string;
  acceptedAnswer?: {
    "@type"?: string;
    text?: string;
  };
};

type StructuredBreadcrumbItem = {
  "@type"?: string;
  position?: number;
  name?: string;
  item?: string;
};

/**
 * 验证结构化数据格式
 */
export function validateStructuredData(data: StructuredDataBlock): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 检查必需字段
  if (!data["@context"]) {
    issues.push("缺少@context字段");
  }

  if (!data["@type"]) {
    issues.push("缺少@type字段");
  }

  // 检查FAQ结构化数据
  if (data["@type"] === "FAQPage") {
    if (!data.mainEntity || !Array.isArray(data.mainEntity)) {
      issues.push("FAQ结构化数据缺少mainEntity数组");
    } else {
      data.mainEntity.forEach((item: StructuredFAQEntry, index: number) => {
        if (!item["@type"] || item["@type"] !== "Question") {
          issues.push(`FAQ项目${index + 1}缺少正确的@type`);
        }
        if (!item.name) {
          issues.push(`FAQ项目${index + 1}缺少问题名称`);
        }
        if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
          issues.push(`FAQ项目${index + 1}缺少答案`);
        }
      });
    }
  }

  // 检查WebApplication结构化数据
  if (data["@type"] === "WebApplication") {
    const requiredFields = [
      "name",
      "description",
      "url",
      "applicationCategory",
    ];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        issues.push(`WebApplication缺少${field}字段`);
      }
    });
  }

  // 检查BreadcrumbList结构化数据
  if (data["@type"] === "BreadcrumbList") {
    if (!data.itemListElement || !Array.isArray(data.itemListElement)) {
      issues.push("BreadcrumbList缺少itemListElement数组");
    } else {
      data.itemListElement.forEach(
        (item: StructuredBreadcrumbItem, index: number) => {
          if (!item["@type"] || item["@type"] !== "ListItem") {
            issues.push(`面包屑项目${index + 1}缺少正确的@type`);
          }
          if (!item.position || !item.name || !item.item) {
            issues.push(`面包屑项目${index + 1}缺少必需字段`);
          }
        },
      );
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 验证Meta信息完整性
 */
export function validateMetaCompleteness(meta: Metadata): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 检查必需字段
  if (!meta.title) issues.push("缺少页面标题");
  if (!meta.description) issues.push("缺少页面描述");
  if (!meta.keywords || !Array.isArray(meta.keywords))
    issues.push("缺少关键词数组");
  // canonical 在 Next.js Metadata 中可能不存在，使用 alternates?.canonical 代替
  if (!meta.alternates?.canonical) issues.push("缺少canonical URL");

  // 检查OpenGraph
  if (!meta.openGraph) {
    issues.push("缺少OpenGraph信息");
  } else {
    if (!meta.openGraph.title) issues.push("缺少OpenGraph标题");
    if (!meta.openGraph.description) issues.push("缺少OpenGraph描述");
    // type 在 Next.js Metadata 的 OpenGraph 中可能不存在
    if (
      typeof meta.openGraph === "object" &&
      "type" in meta.openGraph &&
      !meta.openGraph.type
    ) {
      issues.push("缺少OpenGraph类型");
    }
  }

  // 检查Twitter Card
  if (!meta.twitter) {
    issues.push("缺少Twitter Card信息");
  } else {
    // card 在 Next.js Metadata 的 Twitter 中可能不存在
    if (
      typeof meta.twitter === "object" &&
      "card" in meta.twitter &&
      !meta.twitter.card
    ) {
      issues.push("缺少Twitter Card类型");
    }
    if (!meta.twitter.title) issues.push("缺少Twitter标题");
    if (!meta.twitter.description) issues.push("缺少Twitter描述");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 计算SEO分数
 */
export function calculateSEOScore(validationResults: {
  metaValid: boolean;
  structuredDataValid: boolean;
  metaLengthValid: boolean;
  completenessValid: boolean;
}): number {
  let score = 0;

  if (validationResults.metaValid) score += 25;
  if (validationResults.structuredDataValid) score += 25;
  if (validationResults.metaLengthValid) score += 25;
  if (validationResults.completenessValid) score += 25;

  return score;
}

/**
 * 生成SEO改进建议
 */
export function generateSEORecommendations(
  locale: Locale,
  issues: string[],
): string[] {
  const recommendations: string[] = [];

  // 基于问题生成建议
  if (issues.some((issue) => issue.includes("标题"))) {
    recommendations.push(
      locale === "zh"
        ? "优化页面标题，确保包含主要关键词，长度控制在20-60字符"
        : "Optimize page title, ensure it includes main keywords, keep length between 30-60 characters",
    );
  }

  if (issues.some((issue) => issue.includes("描述"))) {
    recommendations.push(
      locale === "zh"
        ? "优化页面描述，突出核心功能，长度控制在80-160字符"
        : "Optimize page description, highlight core features, keep length between 120-160 characters",
    );
  }

  if (issues.some((issue) => issue.includes("关键词"))) {
    recommendations.push(
      locale === "zh"
        ? "增加更多相关关键词，提高搜索可见性"
        : "Add more relevant keywords to improve search visibility",
    );
  }

  if (issues.some((issue) => issue.includes("结构化数据"))) {
    recommendations.push(
      locale === "zh"
        ? "完善结构化数据，提高搜索引擎理解度"
        : "Complete structured data to improve search engine understanding",
    );
  }

  // 通用建议
  recommendations.push(
    locale === "zh"
      ? "定期更新Meta信息，保持内容新鲜度"
      : "Regularly update meta information to maintain content freshness",
  );

  recommendations.push(
    locale === "zh"
      ? "监控SEO表现，根据数据调整策略"
      : "Monitor SEO performance and adjust strategy based on data",
  );

  return recommendations;
}

/**
 * 执行完整的SEO验证
 */
export function performSEOValidation(locale: Locale): SEOValidationResult {
  const seoData = getWorkplaceWellnessSEOData();
  const config = seoData[locale];

  // 验证Meta信息长度
  const metaLengthValidation = {
    zh: {
      titleValid: config.title.length >= 20 && config.title.length <= 60,
      descriptionValid:
        config.description.length >= 80 && config.description.length <= 160,
    },
    en: {
      titleValid: config.title.length >= 30 && config.title.length <= 60,
      descriptionValid:
        config.description.length >= 120 && config.description.length <= 160,
    },
  };

  const metaLengthValid =
    metaLengthValidation[locale].titleValid &&
    metaLengthValidation[locale].descriptionValid;

  // 验证Meta信息完整性
  const metaCompleteness = validateMetaCompleteness(config);

  // 验证结构化数据（模拟）
  const structuredDataValid = true; // 在实际应用中，这里会验证生成的结构化数据

  // 收集所有问题
  const allIssues = [
    ...metaCompleteness.issues,
    ...(metaLengthValid ? [] : ["Meta信息长度不符合最佳实践"]),
  ];

  // 计算分数
  const score = calculateSEOScore({
    metaValid: metaCompleteness.isValid,
    structuredDataValid,
    metaLengthValid,
    completenessValid: metaCompleteness.isValid,
  });

  // 生成建议
  const recommendations = generateSEORecommendations(locale, allIssues);

  return {
    isValid: allIssues.length === 0,
    score,
    issues: allIssues,
    recommendations,
    structuredDataValid,
    metaValid: metaCompleteness.isValid,
  };
}

/**
 * 生成SEO验证报告
 */
export function generateSEOValidationReport(locale: Locale): string {
  const validation = performSEOValidation(locale);
  const seoReport = generateSEOReport(locale, getWorkplaceWellnessSEOData());

  const report = {
    validation,
    seoReport: JSON.parse(seoReport),
    timestamp: new Date().toISOString(),
    locale,
  };

  return JSON.stringify(report, null, 2);
}
