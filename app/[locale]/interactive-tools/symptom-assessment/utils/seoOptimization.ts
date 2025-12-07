/**
 * Symptom Assessment Tool - SEO优化工具
 * 实现FAQ和HowTo结构化数据生成
 */

import { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import { MEDICAL_ENTITIES } from "@/lib/seo/medical-entities";

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
      mention: Array<{
        "@type": string;
        name: string;
        mechanismOfAction?: string;
      }>;
      citation: {
        "@type": string;
        name: string;
        url: string;
      };
    };
    about: {
      "@type": string;
      name: string;
      code: {
        "@type": string;
        code: string;
        codingSystem: string;
      };
      sameAs?: string;
    };
    medicalAudience: {
      "@type": string;
      audienceType: string;
    };
  }>;
};

type HowToStructuredData = {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  image: string[];
  totalTime: string;
  supply: unknown[];
  tool: unknown[];
  step: Array<{
    "@type": "HowToStep";
    position: number;
    name: string;
    text: string;
    image: string;
  }>;
};

type StructuredDataEntry = FAQStructuredData | HowToStructuredData;

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

  const condition = MEDICAL_ENTITIES.DYSMENORRHEA;

  const citation = {
    "@type": "MedicalGuideline",
    name: "ACOG Practice Bulletin No. 76",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/03/premenstrual-syndrome-and-premenstrual-dysphoric-disorder",
  };

  const drugMention = {
    "@type": "Drug",
    name: "Ibuprofen (布洛芬)",
    mechanismOfAction: "Inhibits prostaglandin synthesis",
  };

  // 使用默认值防止 undefined 错误
  const defaultCondition = {
    name: "Dysmenorrhea",
    icd10: "N94.6",
    snomed: "266599006",
  };

  const safeCondition = condition || defaultCondition;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: t(`faq.${faq.key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${faq.key}.answer`),
        mention: [drugMention],
        citation,
      },
      about: {
        "@type": "MedicalCondition",
        name: safeCondition.name,
        code: {
          "@type": "MedicalCode",
          code: safeCondition.icd10 || "N94.6",
          codingSystem: "ICD-10",
        },
        sameAs: safeCondition.snomed
          ? `http://snomed.info/id/${safeCondition.snomed}`
          : undefined,
      },
      medicalAudience: {
        "@type": "MedicalAudience",
        audienceType: "Patient",
      },
    })),
  };
}

/**
 * 生成HowTo结构化数据
 */
export function generateHowToStructuredData(
  locale: Locale,
  t: TFunction,
): HowToStructuredData {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

  const steps = [
    { key: "step1" },
    { key: "step2" },
    { key: "step3" },
    { key: "step4" },
    { key: "step5" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("howTo.name"),
    description: t("howTo.description"),
    image: [
      `${baseUrl}/images/symptom-assessment-tool-1.jpg`,
      `${baseUrl}/images/symptom-assessment-tool-2.jpg`,
    ],
    totalTime: t("howTo.totalTime"),
    supply: [],
    tool: [],
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: t(`howTo.steps.${step.key}.name`),
      text: t(`howTo.steps.${step.key}.text`),
      image: `${baseUrl}/images/symptom-assessment-step-${index + 1}.jpg`,
    })),
  };
}

/**
 * 生成完整的结构化数据
 */
export function generateAllStructuredData(
  locale: Locale,
  t: TFunction,
): Array<StructuredDataEntry> {
  return [generateFAQStructuredData(t), generateHowToStructuredData(locale, t)];
}
