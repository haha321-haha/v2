import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";
import { generateAllStructuredData } from "./utils/seoOptimization";
import { Locale } from "@/i18n";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import { safeStringify } from "@/lib/utils/json-serialization";

// 生成页面元数据 - 使用翻译系统，避免硬编码
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "periodPainImpactCalculator",
  });

  const title = t("metaTitle");
  const description = t("subtitle");
  const keywords = t("meta.keywords").split(",");

  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/interactive-tools/period-pain-impact-calculator",
    title,
    description,
    keywords,
    structuredDataType: "SoftwareApplication" as unknown as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
    },
  });

  return metadata;
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "periodPainImpactCalculator",
  });
  const breadcrumbT = await getTranslations({
    locale,
    namespace: "interactiveTools.breadcrumb",
  });

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale: locale as "en" | "zh",
    toolSlug: "period-pain-impact-calculator",
    toolName: t("pageTitle"),
    description: t("subtitle"),
    features: [
      t("features.scientificAssessment"),
      t("features.workImpactAnalysis"),
      t("features.lifeQualityEvaluation"),
      t("features.medicalRecommendations"),
      t("features.symptomTracking"),
      t("features.reliefSolutions"),
    ],
    category: "HealthApplication",
    rating: {
      value: 4.8,
      count: 1250,
    },
    breadcrumbs: [
      {
        name: breadcrumbT("interactiveTools"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: t("pageTitle"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/period-pain-impact-calculator`,
      },
    ],
  });

  // 生成其他结构化数据
  const additionalStructuredData = generateAllStructuredData(
    locale as Locale,
    t,
  );

  return (
    <>
      {/* 工具结构化数据 */}
      <ToolStructuredDataScript data={toolStructuredData} />

      {/* 其他结构化数据 */}
      {additionalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
        />
      ))}

      {children}
    </>
  );
}
