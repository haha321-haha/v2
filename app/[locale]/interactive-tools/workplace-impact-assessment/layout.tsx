import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.workplaceImpactAssessment.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "Period Hub",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/workplace-impact-assessment`,
      languages: {
        "zh-CN":
          "https://www.periodhub.health/zh/interactive-tools/workplace-impact-assessment",
        "en-US":
          "https://www.periodhub.health/en/interactive-tools/workplace-impact-assessment",
        "x-default":
          "https://www.periodhub.health/en/interactive-tools/workplace-impact-assessment", // ✅ 修复：默认英文版本（北美市场优先）
      },
    },
  };
}

export default async function WorkplaceImpactAssessmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "workplace-impact-assessment",
    toolName: isZh
      ? "职场影响评估 - 专业痛经对工作影响分析工具"
      : "Workplace Impact Assessment - Professional Menstrual Pain Impact Analysis Tool",
    description: isZh
      ? "专业的职场经期影响评估工具，科学分析痛经对工作效率和职场表现的影响，提供个性化改善建议。"
      : "Professional workplace menstrual impact assessment tool that scientifically analyzes the effects of menstrual pain on work efficiency and workplace performance.",
    features: [
      isZh ? "职场专注度影响评估" : "Workplace concentration impact assessment",
      isZh ? "工作效率损失量化分析" : "Work productivity loss quantification",
      isZh ? "沟通能力影响评估" : "Communication ability impact assessment",
      isZh ? "职场支持需求分析" : "Workplace support needs analysis",
      isZh
        ? "个性化职场调整建议"
        : "Personalized workplace adjustment recommendations",
      isZh ? "长期影响趋势预测" : "Long-term impact trend prediction",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.6,
      count: 750,
    },
    breadcrumbs: [
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "职场影响评估" : "Workplace Impact Assessment",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/workplace-impact-assessment`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />
      {children}
    </>
  );
}
