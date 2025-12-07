/**
 * Page SEO Utilities
 * 页面 SEO 工具函数
 */

export interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  locale?: string;
  path?: string;
  structuredDataType?: StructuredDataType;
  additionalStructuredData?: Record<string, unknown>;
}

export type StructuredDataType = Record<string, unknown>;

/**
 * 生成页面 SEO 元数据
 */
export function generatePageSEO(props: PageSEOProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const locale = props.locale || "en";

  // 处理 canonical URL
  let canonicalUrl = props.canonical;
  if (props.path && !canonicalUrl) {
    canonicalUrl = `${baseUrl}/${locale}/${props.path.replace(/^\//, "")}`;
  }

  const metadata = {
    title: props.title,
    description: props.description,
    keywords: props.keywords?.join(","),

    openGraph: {
      title: props.title,
      description: props.description,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "PeriodHub",
      url: canonicalUrl, // 添加 URL 字段
      ...(props.ogImage && { images: [{ url: props.ogImage }] }),
    },

    twitter: {
      card: "summary_large_image",
      title: props.title,
      description: props.description,
      ...(props.ogImage && { images: [props.ogImage] }),
    },

    alternates: {
      canonical: canonicalUrl,
      languages: {
        "zh-CN": `${baseUrl}/zh`,
        "en-US": `${baseUrl}/en`,
        "x-default": `${baseUrl}/en`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };

  // 生成结构化数据
  let structuredData: Record<string, unknown> | undefined;
  if (props.structuredDataType) {
    const type =
      typeof props.structuredDataType === "string"
        ? props.structuredDataType
        : (props.structuredDataType as Record<string, unknown>)["@type"] ||
          "WebPage";

    structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      name: props.title,
      description: props.description,
      url: canonicalUrl,
      ...(props.ogImage && { image: props.ogImage }),
      ...(props.additionalStructuredData || {}),
    };
  }

  return { metadata, structuredData };
}

import { safeStringify } from "@/lib/utils/json-serialization";

/**
 * 生成 JSON-LD 脚本标签
 */
export function generateJSONLD(data: unknown) {
  return {
    __html: safeStringify(data),
  };
}
