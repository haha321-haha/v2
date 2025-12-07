import { getTranslations } from "next-intl/server";
import SymptomAssessmentClient from "./symptom-assessment-client";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";
import { generateAllStructuredData } from "./utils/seoOptimization";
import { Locale } from "@/i18n";
import { safeStringify } from "@/lib/utils/json-serialization";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interactiveTools" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.symptomAssessmentKeywords").split(","),

    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "PeriodHub",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/symptom-assessment`,
    },

    twitter: {
      card: "summary_large_image",
      title: t("meta.twitterTitle"),
      description: t("meta.twitterDescription"),
    },

    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/symptom-assessment`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/symptom-assessment`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/symptom-assessment`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/symptom-assessment`,
      },
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
  };
}

export default async function SymptomAssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interactiveTools" });
  const isZh = locale === "zh";

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "symptom-assessment",
    toolName: t("meta.title"),
    description: t("meta.description"),
    features: [
      isZh ? "全面的症状评估问卷" : "Comprehensive symptom questionnaire",
      isZh ? "专业的疼痛等级评估" : "Professional pain level assessment",
      isZh ? "个性化健康建议" : "Personalized health recommendations",
      isZh ? "就医指导和建议" : "Medical consultation guidance",
      isZh ? "症状严重程度分析" : "Symptom severity analysis",
      isZh ? "详细的评估报告" : "Detailed assessment report",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.8,
      count: 1250,
    },
    breadcrumbs: [
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "症状评估" : "Symptom Assessment",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/symptom-assessment`,
      },
    ],
    primaryConditionKey: "dysmenorrhea",
    citations: [
      {
        name: "Dysmenorrhea: Painful Periods",
        url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods",
        author: "ACOG",
      },
      {
        name: "Premenstrual Syndrome (PMS)",
        url: "https://www.acog.org/womens-health/faqs/premenstrual-syndrome",
        author: "ACOG",
      },
    ],
    inputs: [
      isZh ? "月经期疼痛评分" : "Daily period pain score",
      isZh ? "症状列表" : "Symptom checklist",
    ],
    outputs: [
      isZh ? "疼痛等级评估" : "Pain severity assessment",
      isZh ? "就医建议与预防指南" : "Consultation advice & prevention tips",
    ],
  });

  // 生成FAQ和HowTo结构化数据
  const symptomAssessmentT = await getTranslations({
    locale,
    namespace: "interactiveToolsPage.symptomAssessment",
  });
  const additionalStructuredData = generateAllStructuredData(
    locale as Locale,
    symptomAssessmentT,
  );

  return (
    <>
      {/* 工具结构化数据 */}
      <ToolStructuredDataScript data={toolStructuredData} />

      {/* FAQ和HowTo结构化数据 */}
      {additionalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
        />
      ))}

      <SymptomAssessmentClient params={{ locale }} />
    </>
  );
}
