/**
 * Medical Schema Generator
 * 医学 Schema 生成器
 *
 * 生成 MedicalWebPage 和 MedicalCondition 的 Schema.org 结构化数据
 *
 * 性能优化：
 * - Schema 对象缓存
 * - 延迟计算
 */

import {
  MEDICAL_ENTITIES,
  getMedicalConditionSchema,
} from "./medical-entities";
import { getCitationsSchema } from "./citations";

/**
 * Schema.org 结构化数据类型
 * 基于 Schema.org 的 MedicalWebPage 类型定义
 */
export interface MedicalWebPageSchema {
  "@context": string;
  "@type": "MedicalWebPage";
  name: string;
  description: string;
  inLanguage: string;
  url?: string;
  medicalAudience: {
    "@type": "MedicalAudience";
    audienceType: string;
    geographicArea: {
      "@type": "AdministrativeArea";
      name: string;
    };
  };
  about: Record<string, unknown>;
  citation?: Array<Record<string, unknown>>;
  reviewedBy: {
    "@type": "Organization";
    name: string;
  };
  lastReviewed?: string;
  mainEntity: Record<string, unknown>;
}

/**
 * Schema 缓存
 */
interface SchemaCacheEntry {
  schema: MedicalWebPageSchema;
  timestamp: number;
}

const schemaCache = new Map<string, SchemaCacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 分钟
const MAX_CACHE_SIZE = 500;

/**
 * 生成缓存键
 */
function getCacheKey(options: MedicalWebPageOptions): string {
  return JSON.stringify({
    title: options.title,
    condition: options.condition,
    citations: options.citations.sort().join(","),
    locale: options.locale,
    url: options.url,
  });
}

/**
 * 清理过期缓存
 */
function cleanSchemaCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of schemaCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => schemaCache.delete(key));

  // 如果缓存仍然太大，删除最旧的条目
  if (schemaCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(schemaCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    );

    const toDelete = sortedEntries.slice(0, schemaCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => schemaCache.delete(key));
  }
}

export interface MedicalWebPageOptions {
  title: string;
  description: string;
  condition: keyof typeof MEDICAL_ENTITIES;
  citations: Array<keyof typeof import("./citations").CITATIONS>;
  locale: "en" | "zh";
  url?: string;
  lastReviewed?: string;
  medicalAdvisoryBoard?: string;
}

/**
 * 生成 MedicalWebPage Schema（带缓存优化）
 */
export function generateMedicalWebPageSchema(options: MedicalWebPageOptions) {
  // 检查缓存
  const cacheKey = getCacheKey(options);
  const cached = schemaCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    // 返回缓存的副本（避免修改缓存）
    return JSON.parse(JSON.stringify(cached.schema));
  }

  // 定期清理缓存
  if (schemaCache.size > MAX_CACHE_SIZE * 0.8) {
    cleanSchemaCache();
  }

  const {
    title,
    description,
    condition,
    citations,
    locale,
    url,
    lastReviewed,
    medicalAdvisoryBoard = "PeriodHub Medical Advisory Board",
  } = options;

  const entity = MEDICAL_ENTITIES[condition];
  if (!entity) {
    throw new Error(`Medical entity not found: ${condition}`);
  }

  // 延迟计算（仅在需要时计算）
  const medicalCondition = getMedicalConditionSchema(condition, locale);
  const citationSchemas = getCitationsSchema(citations);

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: title,
    description: description,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    ...(url && { url: url }),
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
      geographicArea: {
        "@type": "AdministrativeArea",
        name: locale === "zh" ? "China" : "United States",
      },
    },
    about: medicalCondition,
    ...(citationSchemas.length > 0 && {
      citation: citationSchemas,
    }),
    reviewedBy: {
      "@type": "Organization",
      name: medicalAdvisoryBoard,
    },
    ...(lastReviewed && { lastReviewed: lastReviewed }),
    mainEntity: medicalCondition,
  };

  return schema;
}

/**
 * 生成 MedicalCondition Schema（独立使用）
 */
export function generateMedicalConditionSchema(
  condition: keyof typeof MEDICAL_ENTITIES,
  locale: "en" | "zh" = "en",
) {
  return getMedicalConditionSchema(condition, locale);
}
