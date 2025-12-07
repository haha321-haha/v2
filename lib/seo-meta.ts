import { Metadata } from "next";
import { SEO_DEFAULTS } from "./seo-constants";

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | string;
}

export function generateAdvancedMeta({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = SEO_DEFAULTS.OG_IMAGE,
  noindex = false,
  structuredData,
}: SEOMetaProps): Metadata {
  const fullTitle = title.includes("PeriodHub")
    ? title
    : `${title} | PeriodHub`;

  const structuredDataString =
    typeof structuredData === "string"
      ? structuredData
      : structuredData
        ? JSON.stringify(structuredData)
        : undefined;

  const structuredDataEntry = structuredDataString
    ? { "application/ld+json": structuredDataString }
    : {};

  const otherMetadata: Record<string, string | boolean> = {
    "theme-color": SEO_DEFAULTS.THEME_COLOR,
    "msapplication-TileColor": SEO_DEFAULTS.THEME_COLOR,
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    ...structuredDataEntry,
  };

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SEO_DEFAULTS.SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: SEO_DEFAULTS.TWITTER_CREATOR,
    },
    alternates: {
      canonical,
      languages: {
        "zh-CN": canonical,
        "en-US": canonical?.replace("/zh/", "/en/"),
        "x-default": canonical?.replace("/zh/", "/en/") || canonical,
      },
    },
    other: otherMetadata as {
      [name: string]: string | number | (string | number)[];
    },
  };
}

// 页面特定的SEO配置
export const pageConfigs = {
  home: {
    title: "经期健康管理专家",
    description:
      "科学的经期追踪、健康建议和个性化护理方案，让每个女性都能轻松管理自己的生理周期",
    keywords: ["经期追踪", "生理周期", "女性健康", "经期管理", "健康应用"],
  },

  tracker: {
    title: "智能经期追踪器",
    description: "精准预测下次经期，记录症状变化，提供个性化健康建议",
    keywords: ["经期预测", "症状记录", "周期分析", "健康追踪"],
  },

  health: {
    title: "女性健康知识库",
    description: "专业的女性健康知识，经期护理技巧，营养建议和运动指导",
    keywords: ["女性健康", "经期护理", "营养建议", "健康知识"],
  },
};
