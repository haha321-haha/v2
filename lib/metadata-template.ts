import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * 生成页面Metadata的通用模板
 */
export async function generatePageMetadata({
  params,
  namespace = "metadata",
  pageKey,
  additionalMeta = {},
}: {
  params: Promise<{ locale: string }>;
  namespace?: string;
  pageKey: string;
  additionalMeta?: Partial<Metadata>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace });

  return {
    title: t(`${pageKey}.title`),
    description: t(`${pageKey}.description`),
    keywords: t(`${pageKey}.keywords`).split(","),
    openGraph: {
      title: t(`${pageKey}.ogTitle`),
      description: t(`${pageKey}.ogDescription`),
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: t("common.siteName"),
    },
    twitter: {
      card: "summary_large_image",
      title: t(`${pageKey}.twitterTitle`),
      description: t(`${pageKey}.twitterDescription`),
    },
    authors: [{ name: t("common.author") }],
    creator: t("common.creator"),
    publisher: t("common.publisher"),
    ...additionalMeta,
  };
}

/**
 * 生成工具页面Metadata的专用模板
 */
export async function generateToolMetadata({
  params,
  toolKey,
  additionalMeta = {},
}: {
  params: Promise<{ locale: string }>;
  toolKey: string;
  additionalMeta?: Partial<Metadata>;
}): Promise<Metadata> {
  return generatePageMetadata({
    params,
    namespace: "metadata",
    pageKey: `tools.${toolKey}`,
    additionalMeta,
  });
}

/**
 * 生成文章页面Metadata的专用模板
 */
export async function generateArticleMetadata({
  params,
  articleKey,
  additionalMeta = {},
}: {
  params: Promise<{ locale: string }>;
  articleKey: string;
  additionalMeta?: Partial<Metadata>;
}): Promise<Metadata> {
  return generatePageMetadata({
    params,
    namespace: "metadata",
    pageKey: `articles.${articleKey}`,
    additionalMeta,
  });
}
