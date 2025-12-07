/**
 * CollectionPage Structured Data Generator
 * 用于集合页面（工具中心、场景中心、下载中心等）的结构化数据生成
 */

import { safeStringify } from "@/lib/utils/json-serialization";

interface CollectionItem {
  title: string;
  description: string;
  href: string;
  image?: string;
}

interface CollectionStructuredDataProps {
  locale: string;
  pagePath: string;
  name: string;
  description: string;
  items: CollectionItem[];
  additionalInfo?: {
    about?: string;
    audience?: string;
  };
}

export async function generateCollectionStructuredData({
  locale,
  pagePath,
  name,
  description,
  items,
  additionalInfo,
}: CollectionStructuredDataProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const pageUrl = `${baseUrl}/${locale}${pagePath}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name,
    description,
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "PeriodHub",
      publisher: {
        "@type": "Organization",
        name: "PeriodHub",
        url: baseUrl,
      },
    },
    ...(additionalInfo?.about && {
      about: {
        "@type": "Thing",
        name: additionalInfo.about,
      },
    }),
    ...(additionalInfo?.audience && {
      audience: {
        "@type": "Audience",
        audienceType: additionalInfo.audience,
      },
    }),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          "@id": `${baseUrl}${item.href}`,
          url: `${baseUrl}${item.href}`,
          name: item.title,
          description: item.description,
          ...(item.image && {
            image: {
              "@type": "ImageObject",
              url: `${baseUrl}${item.image}`,
            },
          }),
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": baseUrl,
            name: "Home",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": pageUrl,
            name,
          },
        },
      ],
    },
  };
}

/**
 * CollectionPage 结构化数据脚本组件
 */
export function CollectionStructuredDataScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(data),
      }}
    />
  );
}
