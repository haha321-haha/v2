/**
 * Article Structured Data Generator
 * 生成文章的结构化数据
 */

import { medicalEntities } from "./medical-entities";

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
  primaryConditionKey?: keyof typeof medicalEntities;
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
    ? medicalEntities[props.primaryConditionKey]
    : medicalEntities.dysmenorrhea;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": props.url,
    url: props.url,
    name: props.title,
    headline: props.headline,
    description: props.description,
    inLanguage: props.locale === "zh" ? "zh-CN" : "en-US",
    isAccessibleForFree: true,
    datePublished: props.publishedAt,
    dateModified: props.updatedAt,
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
      name: condition.name,
      code: {
        "@type": "MedicalCode",
        code: condition.icd10,
        codingSystem: "ICD-10",
      },
      sameAs: condition.snomed
        ? `http://snomed.info/id/${condition.snomed}`
        : undefined,
    },
    isBasedOn:
      props.citations?.map((citation) => ({
        "@type": "MedicalScholarlyArticle",
        name: citation.name,
        url: citation.url,
        author: {
          "@type": "Organization",
          name: citation.author,
        },
      })) || [],
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
  };
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
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}
