import {
  safeStringify,
  cleanDataForJSON,
} from "@/lib/utils/json-serialization";

interface EnhancedStructuredDataProps {
  type: "website" | "article" | "faq" | "howto" | "medicalwebpage";
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  steps?: Array<{
    name: string;
    text: string;
  }>;
}

export default function EnhancedStructuredData({
  type,
  title,
  description,
  url,
  image,
  author,
  datePublished,
  dateModified,
  faqItems,
  steps,
}: EnhancedStructuredDataProps) {
  const baseData = {
    "@context": "https://schema.org",
    name: title,
    description: description,
    url: url,
    ...(image && { image: image }),
  };

  let structuredData;

  switch (type) {
    case "website":
      structuredData = {
        ...baseData,
        "@type": "WebSite",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };
      break;

    case "article":
      structuredData = {
        ...baseData,
        "@type": "Article",
        headline: title,
        author: {
          "@type": "Organization",
          name: author || "PeriodHub Health Team",
        },
        publisher: {
          "@type": "Organization",
          name: "PeriodHub",
          logo: {
            "@type": "ImageObject",
            url: `${
              process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
            }/icon-512.png`,
          },
        },
        ...(datePublished && { datePublished: datePublished }),
        ...(dateModified && { dateModified: dateModified }),
      };
      break;

    case "faq":
      structuredData = {
        ...baseData,
        "@type": "FAQPage",
        ...(faqItems &&
          faqItems.length > 0 && {
            mainEntity: faqItems
              .filter((item) => item.question && item.answer) // 过滤空问题或答案
              .map((item) => ({
                "@type": "Question",
                name: item.question.trim(),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer.trim(),
                },
              })),
          }),
      };
      // 确保有有效的 mainEntity
      if (
        structuredData.mainEntity &&
        Array.isArray(structuredData.mainEntity) &&
        structuredData.mainEntity.length === 0
      ) {
        delete structuredData.mainEntity;
      }
      break;

    case "howto":
      structuredData = {
        ...baseData,
        "@type": "HowTo",
        ...(steps &&
          steps.length > 0 && {
            step: steps
              .filter((step) => step.name && step.text) // 过滤空步骤
              .map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.name.trim(),
                text: step.text.trim(),
              })),
          }),
      };
      // 确保有有效的 step
      if (
        structuredData.step &&
        Array.isArray(structuredData.step) &&
        structuredData.step.length === 0
      ) {
        delete structuredData.step;
      }
      break;

    case "medicalwebpage":
      structuredData = {
        ...baseData,
        "@type": "MedicalWebPage",
        medicalAudience: {
          "@type": "MedicalAudience",
          audienceType: "Patient",
        },
        about: {
          "@type": "MedicalCondition",
          name: "Menstrual Health",
        },
      };
      break;

    default:
      // 确保 default 分支也有 @type 字段
      structuredData = {
        ...baseData,
        "@type": "WebPage", // 默认类型
      };
  }

  // 确保最终数据包含必需的字段且没有空字符串
  const cleanedData = cleanDataForJSON(structuredData);

  // 验证数据有效性
  if (!cleanedData || typeof cleanedData !== "object") {
    console.error("Structured data cleaning failed:", cleanedData);
    return null; // 不渲染无效的结构化数据
  }

  const finalData = cleanedData as Record<string, unknown>;

  // 验证 @type 字段存在且非空
  if (
    !finalData["@type"] ||
    typeof finalData["@type"] !== "string" ||
    finalData["@type"] === ""
  ) {
    console.error("Structured data missing or invalid @type field:", finalData);
    return null; // 不渲染无效的结构化数据
  }

  // 验证 @context 字段
  if (
    !finalData["@context"] ||
    typeof finalData["@context"] !== "string" ||
    finalData["@context"] === ""
  ) {
    console.error(
      "Structured data missing or invalid @context field:",
      finalData,
    );
    return null; // 不渲染无效的结构化数据
  }

  // 验证必需的基本字段
  if (
    !finalData["name"] ||
    typeof finalData["name"] !== "string" ||
    finalData["name"].trim() === ""
  ) {
    console.warn("Structured data missing or empty name field:", finalData);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(finalData),
      }}
    />
  );
}
