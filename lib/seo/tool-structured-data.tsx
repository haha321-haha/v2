import { MEDICAL_ENTITIES } from "./medical-entities";
import { safeStringify } from "@/lib/utils/json-serialization";

interface ToolStructuredDataProps {
  locale: "en" | "zh" | string;
  toolSlug: string;
  toolName: string;
  description: string;
  features?: string[];
  category?: string;
  rating?: {
    value: number;
    count: number;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  primaryConditionKey?: keyof typeof MEDICAL_ENTITIES;
  citations?: Array<{
    name: string;
    url: string;
    author: string;
  }>;
  inputs?: string[];
  outputs?: string[];
}

export async function generateToolStructuredData({
  locale,
  toolSlug,
  toolName,
  description,
  features = [],
  category = "HealthApplication",
  rating = { value: 4.8, count: 1250 },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  breadcrumbs = [],
  primaryConditionKey = "DYSMENORRHEA",
  citations = [
    {
      name: "Dysmenorrhea: Painful Periods",
      url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods",
      author: "ACOG",
    },
  ],
  inputs = [],
  outputs = [],
}: ToolStructuredDataProps) {
  // 确保 locale 类型正确
  const validLocale = locale === "en" || locale === "zh" ? locale : "en";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const toolUrl = `${baseUrl}/${validLocale}/interactive-tools/${toolSlug}`;

  // 构建面包屑结构化数据（如果需要，可以在@graph中添加）

  const primaryCondition = MEDICAL_ENTITIES[primaryConditionKey];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${toolUrl}#application`,
        name: toolName,
        description: description,
        url: toolUrl,
        applicationCategory: category,
        operatingSystem: "Web",
        inLanguage: validLocale === "zh" ? "zh-CN" : "en-US",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList:
          features.length > 0
            ? features
            : [
                validLocale === "zh" ? "症状评估" : "Symptom Assessment",
                validLocale === "zh"
                  ? "个性化建议"
                  : "Personalized Recommendations",
                validLocale === "zh" ? "健康报告" : "Health Reports",
              ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.value.toString(),
          ratingCount: rating.count.toString(),
          bestRating: "5",
          worstRating: "1",
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/icon-512.png`,
            width: 512,
            height: 512,
          },
        },
        author: {
          "@type": "Organization",
          name: "PeriodHub Health Team",
          url: baseUrl,
        },
        datePublished: "2025-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": toolUrl,
        },
        about: {
          "@type": "MedicalCondition",
          name: primaryCondition.name,
          alternateName:
            validLocale === "zh"
              ? ["月经疼痛", "经期疼痛", "Dysmenorrhea"]
              : ["Menstrual Pain", "Period Pain", "痛经"],
          ...(primaryCondition.icd10 && {
            code: {
              "@type": "MedicalCode",
              code: primaryCondition.icd10,
              codingSystem: "ICD-10",
            },
          }),
          ...(primaryCondition.snomed && {
            sameAs: `http://snomed.info/id/${primaryCondition.snomed}`,
          }),
        },
        ...(inputs.length > 0 && { input: inputs }),
        ...(outputs.length > 0 && { output: outputs }),
        isBasedOn: citations.map((citation) => ({
          "@type": "MedicalScholarlyArticle",
          name: citation.name,
          url: citation.url,
          author: {
            "@type": "Organization",
            name: citation.author,
          },
        })),
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
        potentialAction: {
          "@type": "AssessAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: toolUrl,
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
          result: {
            "@type": "MedicalWebPage",
            name: `${toolName} Assessment Result`,
          },
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${toolUrl}#webapp`,
        name: toolName,
        description: description,
        url: toolUrl,
        applicationCategory: category,
        operatingSystem: "Web",
        inLanguage: validLocale === "zh" ? "zh-CN" : "en-US",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          url: baseUrl,
        },
      },
    ],
  };
}

export function ToolStructuredDataScript({
  data,
}: {
  data: Record<string, unknown>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(data),
      }}
    />
  );
}
