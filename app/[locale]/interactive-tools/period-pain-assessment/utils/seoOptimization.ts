/**
 * Period Pain Assessment Hub - SEO优化工具
 * 实现FAQ和CollectionPage结构化数据生成
 */

import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

type FAQStructuredData = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
};

type CollectionPageStructuredData = {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    "@type": "WebSite";
    name: string;
    url: string;
  };
  mainEntity: {
    "@type": "ItemList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      name: string;
      url: string;
    }>;
  };
};

/**
 * 生成FAQ结构化数据
 */
export function generateFAQStructuredData(t: TFunction): FAQStructuredData {
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
 * 生成CollectionPage结构化数据
 */
export function generateCollectionPageSchema(
  locale: Locale,
  t: TFunction,
): CollectionPageStructuredData {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("structuredData.collectionPage.name"),
    description: t("structuredData.collectionPage.description"),
    url: `${baseUrl}/${locale}/interactive-tools/period-pain-assessment`,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "PeriodHub",
      url: `${baseUrl}/${locale}`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("structuredData.collectionPage.items.calculator"),
          url: `${baseUrl}/${locale}/interactive-tools/period-pain-impact-calculator`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("structuredData.collectionPage.items.assessment"),
          url: `${baseUrl}/${locale}/interactive-tools/symptom-assessment`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: t("structuredData.collectionPage.items.relief"),
          url: `${baseUrl}/${locale}/articles/home-natural-menstrual-pain-relief`,
        },
      ],
    },
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(
  locale: Locale,
  t: TFunction,
): Array<FAQStructuredData | CollectionPageStructuredData> {
  return [
    generateFAQStructuredData(t),
    generateCollectionPageSchema(locale, t),
  ];
}
