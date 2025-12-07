import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Locale, locales } from "@/i18n";
import OptimizedMobilePDFCenter from "@/components/OptimizedMobilePDFCenter";
import { SITE_CONFIG } from "@/config/site.config";
import { pdfResources } from "@/config/pdfResources";
import { SmartPreloadProvider } from "@/components/SmartPreloadProvider";
import DownloadModal from "@/components/DownloadModal";
import {
  generateHreflangConfig,
  HreflangScript,
} from "@/lib/seo/multilingual-seo";
import { safeStringify } from "@/lib/utils/json-serialization";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import { Suspense } from "react";
import FeedbackBanner from "./components/FeedbackBanner";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloadsPage" });

  // 使用统一的SEO配置函数
  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/downloads",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    ogImage: "/images/downloads-og.jpg",
    structuredDataType: "CollectionPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      numberOfItems: pdfResources.length,
      description: t("description"),
    },
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      title: t("openGraph.title") || t("title"),
      description: t("openGraph.description") || t("description"),
    },
    twitter: {
      ...metadata.twitter,
      title: t("openGraph.title") || t("title"),
      description: t("openGraph.description") || t("description"),
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "downloadsPage" });
  const bannerText = t("banner.text");

  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("structuredData.name"),
    description: t("structuredData.description"),
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
    }/${locale}/downloads`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pdfResources.length,
      itemListElement: pdfResources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "DigitalDocument",
          name: resource.title,
          description: resource.description,
          fileSize: `${resource.fileSize}KB`,
          url: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
          }${resource.downloadUrl}`,
          encodingFormat: "application/pdf",
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("breadcrumb.home"),
          item: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
          }/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("breadcrumb.downloadCenter"),
          item: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
          }/${locale}/downloads`,
        },
      ],
    },
  };

  // 生成hreflang配置
  const hreflangUrls = await generateHreflangConfig({
    locale,
    path: "/downloads",
  });

  return (
    <SmartPreloadProvider>
      {/* hreflang标签 */}
      <HreflangScript hreflangUrls={hreflangUrls} />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        {/* 🎉 新版本标识横幅 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 mb-6 rounded-xl animate-pulse-slow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-bold" suppressHydrationWarning>
                {bannerText}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 页面标题区域 */}
          <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <Download className="w-8 h-8 text-white" />
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              suppressHydrationWarning
            >
              {t("content.title")}
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
              {t("content.description")}
            </p>

            {/* 邮箱收集入口 */}
            <div className="mb-6 flex justify-center">
              <DownloadModal
                locale={locale}
                buttonText={
                  t("content.emailCollectionButton") ||
                  (locale === "zh"
                    ? "📧 发送PDF到邮箱"
                    : "📧 Send PDFs to Email")
                }
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                source="downloads-page"
              />
            </div>

            {/* 快速统计 */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {SITE_CONFIG.statistics.articles}
                </div>
                <div className="text-sm text-gray-500">
                  {t("content.statistics.expertArticles")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {SITE_CONFIG.statistics.pdfResources}
                </div>
                <div className="text-sm text-gray-500">
                  {t("content.statistics.pdfResources")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">2</div>
                <div className="text-sm text-gray-500">
                  {t("content.statistics.languages")}
                </div>
              </div>
            </div>
          </header>

          {/* 🚀 优化版移动端PDF中心组件 - 实现"我现在需要什么帮助？"界面 */}
          <OptimizedMobilePDFCenter locale={locale} />

          {/* 💡 用户反馈组件 - 客户端组件 */}
          <Suspense fallback={null}>
            <FeedbackBanner locale={locale} />
          </Suspense>
        </div>
      </div>
    </SmartPreloadProvider>
  );
}
