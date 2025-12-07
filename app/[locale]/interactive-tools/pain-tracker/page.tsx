import { getTranslations } from "next-intl/server";
import PainTrackerClient from "./pain-tracker-client";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";

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
    keywords: t("meta.keywords").split(","),

    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "PeriodHub",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/pain-tracker`,
    },

    twitter: {
      card: "summary_large_image",
      title: t("meta.twitterTitle"),
      description: t("meta.twitterDescription"),
    },

    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/pain-tracker`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/pain-tracker`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/pain-tracker`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/pain-tracker`, // ✅ 修复：默认英文版本（北美市场优先）
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

export default async function PainTrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "interactiveTools" });
  const painTrackerT = await getTranslations({
    locale,
    namespace: "interactiveTools.painTracker",
  });
  const breadcrumbT = await getTranslations({
    locale,
    namespace: "interactiveTools.breadcrumb",
  });

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "pain-tracker",
    toolName: t("meta.title"),
    description: t("meta.description"),
    features: [
      painTrackerT("features.dailyRecording"),
      painTrackerT("features.patternVisualization"),
      painTrackerT("features.trendCharts"),
      painTrackerT("features.cyclicalIdentification"),
      painTrackerT("features.triggerAnalysis"),
      painTrackerT("features.dataExport"),
    ],
    category: "HealthApplication",
    rating: {
      value: 4.7,
      count: 980,
    },
    breadcrumbs: [
      {
        name: breadcrumbT("interactiveTools"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: breadcrumbT("painTracker"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/pain-tracker`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />
      <PainTrackerClient params={{ locale }} />
    </>
  );
}
