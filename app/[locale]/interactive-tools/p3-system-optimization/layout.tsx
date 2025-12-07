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
    "interactive-tools/p3-system-optimization",
  );
  const alternates = {
    canonical: alternatesData[locale === "zh" ? "zh-CN" : "en-US"],
    languages: alternatesData,
  };

  return {
    title: isZh
      ? "系统优化 - 痛经管理工具 | PeriodHub"
      : "System Optimization - Period Pain Management Tools | PeriodHub",
    description: isZh
      ? "了解PeriodHub的系统优化功能，包括性能提升、用户体验改进、数据同步等专业优化工具。"
      : "Learn about PeriodHub's system optimization features including performance improvements, user experience enhancements, data synchronization, and professional optimization tools.",
    alternates,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function P3SystemOptimizationLayout({
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
    toolSlug: "p3-system-optimization",
    toolName: isZh
      ? "系统优化 - 痛经管理工具"
      : "System Optimization - Period Pain Management Tools",
    description: isZh
      ? "了解PeriodHub的系统优化功能，包括性能提升、用户体验改进、数据同步等专业优化工具。"
      : "Learn about PeriodHub's system optimization features including performance improvements, user experience enhancements, data synchronization, and professional optimization tools.",
    features: [
      isZh ? "国际化优化" : "Internationalization Optimization",
      isZh ? "性能监控" : "Performance Monitoring",
      isZh ? "用户体验改进" : "User Experience Enhancements",
      isZh ? "数据同步优化" : "Data Synchronization Optimization",
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
        name: isZh ? "系统优化" : "System Optimization",
        url: `https://www.periodhub.health/${locale}/interactive-tools/p3-system-optimization`,
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
