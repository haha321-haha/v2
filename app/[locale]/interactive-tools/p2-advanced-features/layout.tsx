import { Metadata } from "next";
import { generateAlternatesConfig } from "@/lib/seo/canonical-url-utils";
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
  const isZh = locale === "zh";

  // 生成canonical和hreflang配置
  const alternatesData = generateAlternatesConfig(
    "interactive-tools/p2-advanced-features",
  );
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title: isZh
      ? "高级功能 - 痛经管理工具 | PeriodHub"
      : "Advanced Features - Period Pain Management Tools | PeriodHub",
    description: isZh
      ? "探索PeriodHub的高级功能，包括数据分析、个性化建议、社交功能等专业痛经管理工具。"
      : "Explore PeriodHub's advanced features including data analytics, personalized recommendations, social features, and professional period pain management tools.",
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function P2AdvancedFeaturesLayout({
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
    locale: locale as "en" | "zh",
    toolSlug: "p2-advanced-features",
    toolName: isZh
      ? "高级功能 - 痛经管理工具"
      : "Advanced Features - Period Pain Management Tools",
    description: isZh
      ? "探索PeriodHub的高级功能，包括数据分析、个性化建议、社交功能等专业痛经管理工具。"
      : "Explore PeriodHub's advanced features including data analytics, personalized recommendations, social features, and professional period pain management tools.",
    features: [
      isZh ? "数据分析仪表板" : "Data Analytics Dashboard",
      isZh ? "个性化推荐引擎" : "Personalized Recommendation Engine",
      isZh ? "社交功能" : "Social Features",
      isZh ? "数据同步" : "Data Synchronization",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.8,
      count: 1250,
    },
    breadcrumbs: [
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `https://www.periodhub.health/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "高级功能" : "Advanced Features",
        url: `https://www.periodhub.health/${locale}/interactive-tools/p2-advanced-features`,
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
