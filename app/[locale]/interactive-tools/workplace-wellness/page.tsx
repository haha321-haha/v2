/**
 * Workplace Wellness Assistant - Main Page
 * Day 10: User Experience Optimization - Responsive Design Optimization
 * Based on HVsLYEp renderer.js structure design
 */

import { Metadata } from "next";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import { getTranslations } from "next-intl/server";
// 使用客户端包装组件，完全禁用 SSR
import WorkplaceWellnessWrapper from "./WorkplaceWellnessWrapper";

// 生成页面元数据（包含Canonical配置）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "workplaceWellness.meta",
  });

  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/interactive-tools/workplace-wellness",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    structuredDataType: "SoftwareApplication" as unknown as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      featureList: [
        t("features.workplaceOptimization"),
        t("features.healthTracking"),
        t("features.personalizedRecommendations"),
      ],
    },
  });

  return metadata;
}

// 服务器组件渲染
export default async function WorkplaceWellnessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 解析 params 参数
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // 将 locale 作为 prop 传递给客户端组件
  return <WorkplaceWellnessWrapper locale={locale} />;
}
