/**
 * Article Structured Data Generator
 * 生成文章的结构化数据
 */

import { MEDICAL_ENTITIES } from "./medical-entities";
import {
  safeStringify,
  cleanDataForJSON,
} from "@/lib/utils/json-serialization";

export interface ArticleStructuredDataScriptProps {
  data: Record<string, unknown>;
}

export interface ArticleStructuredDataProps {
  url: string;
  title: string;
  headline: string;
  description: string;
  locale: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  primaryConditionKey?: keyof typeof MEDICAL_ENTITIES;
  citations?: Array<{
    name: string;
    url: string;
    author: string;
  }>;
}

/**
 * 生成文章结构化数据
 */
export function generateArticleStructuredData(
  props: ArticleStructuredDataProps,
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const condition = props.primaryConditionKey
    ? MEDICAL_ENTITIES[props.primaryConditionKey]
    : MEDICAL_ENTITIES.DYSMENORRHEA;

  // 确保所有必需字段都有值，避免undefined
  const safeTitle = props.title || "";
  const safeHeadline = props.headline || props.title || "";
  const safeDescription = props.description || "";
  const safePublishedAt = props.publishedAt || new Date().toISOString();
  const safeUpdatedAt =
    props.updatedAt || props.publishedAt || new Date().toISOString();
  const safeImageUrl = props.imageUrl || `${baseUrl}/images/article-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": props.url,
    url: props.url,
    name: safeTitle,
    headline: safeHeadline,
    description: safeDescription,
    inLanguage: props.locale === "zh" ? "zh-CN" : "en-US",
    isAccessibleForFree: true,
    datePublished: safePublishedAt,
    dateModified: safeUpdatedAt,
    ...(safeImageUrl && {
      image: {
        "@type": "ImageObject",
        url: safeImageUrl,
      },
    }),
    author: {
      "@type": "Organization",
      name: "PeriodHub Health Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "PeriodHub",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.url,
    },
    about: {
      "@type": "MedicalCondition",
      name: condition.name || "Dysmenorrhea",
      ...(condition.icd10 && {
        code: {
          "@type": "MedicalCode",
          code: condition.icd10,
          codingSystem: "ICD-10",
        },
      }),
      ...(condition.snomed && {
        sameAs: `http://snomed.info/id/${condition.snomed}`,
      }),
    },
    ...(props.citations &&
      props.citations.length > 0 && {
        isBasedOn: props.citations
          .filter((citation) => citation.name && citation.url) // 过滤空值
          .map((citation) => ({
            "@type": "MedicalScholarlyArticle",
            name: citation.name,
            url: citation.url,
            author: {
              "@type": "Organization",
              name: citation.author || "PeriodHub Team",
            },
          })),
      }),
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
  };

  // 🔧 关键修复：在返回前清理数据，确保所有值都是可序列化的
  // 这可以防止 Next.js 在传递 props 时尝试序列化包含不可序列化值的对象
  return cleanDataForJSON(structuredData) as typeof structuredData;
}

/**
 * 文章结构化数据脚本组件
 */
export function ArticleStructuredDataScript({
  data,
}: ArticleStructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(data),
      }}
    />
  );
}
