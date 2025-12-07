import React from "react";
import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { ArticleContent } from "@/components/ArticleContent";
import {
  generateArticleStructuredData,
  ArticleStructuredDataScript,
} from "@/lib/seo/article-structured-data";
import {
  generateBreadcrumbStructuredData,
  BreadcrumbStructuredDataScript,
} from "@/lib/seo/breadcrumb-structured-data";

// 按需导入Lucide React图标 - 第三方脚本优化（移除ssr: false）
const Home = dynamic(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home })),
);

// 优化的懒加载组件 - 代码分割优化（Server Component兼容）
const NSAIDInteractive = dynamic(
  () => import("@/components/NSAIDInteractive"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

const NSAIDContentSimple = dynamic(
  () => import("@/components/NSAIDContentSimple"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-24 rounded-lg" />
    ),
  },
);

// const StructuredData = dynamic(() => import("@/components/StructuredData"));

const ArticleInteractions = dynamic(
  () => import("@/components/ArticleInteractions"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg" />
    ),
  },
);

const ReadingProgress = dynamic(() => import("@/components/ReadingProgress"));

const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />,
});

const MarkdownWithMermaid = dynamic(
  () => import("@/components/MarkdownWithMermaid"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
    ),
  },
);

// Server Component面包屑组件
interface BreadcrumbItem {
  label: string;
  href?: string;
}

function ServerBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
              </li>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Types
type Locale = "en" | "zh";

// Article interface
// interface Article {
//   slug: string;
//   title: string;
//   title_zh?: string;
//   date: string;
//   summary: string;
//   summary_zh?: string;
//   tags: string[];
//   tags_zh?: string[];
//   category: string;
//   category_zh?: string;
//   author: string;
//   featured_image: string;
//   reading_time: string;
//   reading_time_zh?: string;
//   content: string;
//   seo_title?: string;
//   seo_title_zh?: string;
//   seo_description?: string;
//   seo_description_zh?: string;
//   canonical_url?: string;
//   schema_type?: string;
// }

// 使用lib/articles.ts中的函数

// 移除本地定义，使用lib/articles.ts中的函数

// Generate static params for all articles
export async function generateStaticParams() {
  const locales: Locale[] = ["en", "zh"];
  const articleSlugs = [
    // 现有文章保持不变
    "5-minute-period-pain-relief",
    "anti-inflammatory-diet-period-pain",
    "comprehensive-iud-guide",
    "comprehensive-medical-guide-to-dysmenorrhea",
    "essential-oils-aromatherapy-menstrual-pain-guide",
    "global-traditional-menstrual-pain-relief",
    "heat-therapy-complete-guide",
    "herbal-tea-menstrual-pain-relief",
    "hidden-culprits-of-menstrual-pain",
    "home-natural-menstrual-pain-relief",
    "magnesium-gut-health-comprehensive-guide",
    "menstrual-nausea-relief-guide",
    "menstrual-pain-accompanying-symptoms-guide",
    "menstrual-pain-complications-management",
    "menstrual-pain-faq-expert-answers",
    "menstrual-pain-medical-guide",
    "menstrual-pain-vs-other-abdominal-pain-guide",
    "natural-physical-therapy-comprehensive-guide",
    "nsaid-menstrual-pain-professional-guide",
    "period-friendly-recipes",
    "personal-menstrual-health-profile",
    "recommended-reading-list",
    "specific-menstrual-pain-management-guide",
    "comprehensive-menstrual-sleep-quality-guide",
    "menstrual-pain-research-progress-2024",
    "menstrual-preventive-care-complete-plan",
    "menstrual-stress-management-complete-guide",
    "understanding-your-cycle",
    "us-menstrual-pain-insurance-coverage-guide",
    "when-to-see-doctor-period-pain",
    "when-to-seek-medical-care-comprehensive-guide",
    "womens-lifecycle-menstrual-pain-analysis",
    "zhan-zhuang-baduanjin-for-menstrual-pain-relief",

    // 🔧 添加缺失的文章slug（修复404错误）
    "ginger-menstrual-pain-relief-guide", // immediate-5
    "comprehensive-report-non-medical-factors-menstrual-pain", // management-1 & management-7
    "period-pain-simulator-accuracy-analysis", // management-8
    "medication-vs-natural-remedies-menstrual-pain", // management-9

    // 🔧 添加缺失的文章slug（文件存在但不在articleSlugs中）
    "menstrual-back-pain-comprehensive-care-guide", // 文件存在
    "effective-herbal-tea-menstrual-pain", // 文件存在
    "menstrual-pain-back-pain-connection", // 文件存在
    "menstrual-pain-emergency-medication-guide", // 文件存在
    "menstrual-sleep-quality-improvement-guide", // 文件存在

    // 🚨 IndexNow映射slug - 这些是别名，需要在ArticlePage中处理重定向
    "pain-complications-management", // 对应 menstrual-pain-complications-management
    "health-tracking-and-analysis", // 对应 personal-menstrual-health-profile
    "evidence-based-pain-guidance", // 对应 menstrual-pain-medical-guide
    "sustainable-health-management", // 对应 menstrual-preventive-care-complete-plan
    "personal-health-profile", // 已存在，确保包含
    "anti-inflammatory-diet-guide", // 对应 anti-inflammatory-diet-period-pain
    "long-term-healthy-lifestyle-guide", // 文件存在
    "iud-comprehensive-guide", // 对应 comprehensive-iud-guide
  ];

  const params = [];
  for (const locale of locales) {
    for (const slug of articleSlugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

// Generate metadata for the article
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // 🔒 添加路径验证，防止图片请求被误解析为文章请求
  // 这必须在尝试获取文章之前检查，因为 generateMetadata 在组件之前被调用
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    // 返回默认 metadata，避免抛出错误
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // 检查是否是图片请求（包含文件扩展名）
  if (
    slug.includes(".") &&
    (slug.endsWith(".jpg") ||
      slug.endsWith(".jpeg") ||
      slug.endsWith(".png") ||
      slug.endsWith(".webp") ||
      slug.endsWith(".gif") ||
      slug.endsWith(".svg") ||
      slug.endsWith(".ico"))
  ) {
    // 返回默认 metadata，避免抛出错误
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // 检查是否是静态资源请求
  if (
    slug.startsWith("images/") ||
    slug.startsWith("static/") ||
    slug.startsWith("assets/")
  ) {
    // 返回默认 metadata，避免抛出错误
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // 🚨 IndexNow映射slug处理 - 将别名重定向到实际slug
  const slugMapping: Record<string, string> = {
    "pain-complications-management": "menstrual-pain-complications-management",
    "health-tracking-and-analysis": "personal-menstrual-health-profile",
    "evidence-based-pain-guidance": "menstrual-pain-medical-guide",
    "sustainable-health-management": "menstrual-preventive-care-complete-plan",
    "anti-inflammatory-diet-guide": "anti-inflammatory-diet-period-pain",
    "iud-comprehensive-guide": "comprehensive-iud-guide",
  };

  // 如果slug是映射别名，使用实际slug
  const actualSlug = slugMapping[slug] || slug;
  const article = await getArticleBySlug(actualSlug);

  // 如果文章不存在，在构建时就应该失败，而不是返回默认metadata
  // 这样可以确保只有存在的文章才会被静态生成
  if (!article) {
    // 在构建时，如果generateStaticParams中包含了这个slug，但文章不存在
    // 说明配置有问题，应该抛出错误
    // 使用 actualSlug 而不是 slug，因为可能是映射后的slug
    throw new Error(
      `Article not found for slug: ${actualSlug} (original: ${slug}). This should not happen if generateStaticParams is correct.`,
    );
  }

  const title =
    locale === "zh"
      ? article.title_zh || article.titleZh || article.title || ""
      : article.title || "";
  const description =
    locale === "zh"
      ? article.summary_zh || article.descriptionZh || article.description || ""
      : article.summary || article.description || "";
  const seoTitle = title;
  const seoDescription = description;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  // 使用 actualSlug 而不是 slug，确保 canonical URL 使用实际的文章 slug
  const canonicalUrl = `/${locale}/articles/${actualSlug}`;
  const articleUrl = `${baseUrl}${canonicalUrl}`;

  // 安全地处理日期，确保始终是有效的 ISO 字符串
  const safePublishedDateForMetadata = (() => {
    if (!article.publishedAt) {
      return new Date().toISOString();
    }
    const date = new Date(article.publishedAt);
    return isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  })();

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: article.tags,
    authors: [{ name: "PeriodHub Team" }],
    // 🔧 修复：添加明确的robots配置，确保文章页面被正确索引
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
    other: {
      "fb:app_id":
        process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1234567890123456",
      "article:published_time": safePublishedDateForMetadata,
      "article:author": "PeriodHub Team",
      "Content-Language": locale === "zh" ? "zh-CN" : "en-US",
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: articleUrl,
      type: "article",
      publishedTime: safePublishedDateForMetadata,
      authors: ["PeriodHub Team"],
      images: [
        {
          url: "/images/article-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ["/images/article-image.jpg"],
    },
    alternates: {
      canonical: articleUrl,
      languages: {
        "en-US": `${baseUrl}/en/articles/${slug}`,
        "zh-CN": `${baseUrl}/zh/articles/${slug}`,
        "x-default": `${baseUrl}/en/articles/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  // 添加路径验证，防止图片请求被误解析为文章请求
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    notFound();
  }

  // 检查是否是图片请求（包含文件扩展名）
  if (
    slug.includes(".") &&
    (slug.endsWith(".jpg") ||
      slug.endsWith(".jpeg") ||
      slug.endsWith(".png") ||
      slug.endsWith(".webp") ||
      slug.endsWith(".gif"))
  ) {
    notFound();
  }

  // 检查是否是静态资源请求
  if (
    slug.startsWith("images/") ||
    slug.startsWith("static/") ||
    slug.startsWith("assets/")
  ) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  // 🔍 生产性能监控开始
  const requestStart = Date.now();

  try {
    // eslint-disable-next-line no-console
    // Production monitoring: Request start
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console

    // 检测冷启动
    const coldStartCheck = Date.now();
    if (!(global as Record<string, unknown>).isWarm) {
      (global as Record<string, unknown>).isWarm = true;
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-console
      console.log(
        `[PROD-MONITOR] Cold start detected - initialization: ${
          Date.now() - coldStartCheck
        }ms`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `[PROD-MONITOR] Warm start - check: ${Date.now() - coldStartCheck}ms`,
      );
    }

    // 文章获取计时
    const articleFetchStart = Date.now();
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log("ArticlePage - Processing:", { locale, slug });

    // 🚨 IndexNow映射slug处理 - 将别名重定向到实际slug
    const slugMapping: Record<string, string> = {
      "pain-complications-management":
        "menstrual-pain-complications-management",
      "health-tracking-and-analysis": "personal-menstrual-health-profile",
      "evidence-based-pain-guidance": "menstrual-pain-medical-guide",
      "sustainable-health-management":
        "menstrual-preventive-care-complete-plan",
      "anti-inflammatory-diet-guide": "anti-inflammatory-diet-period-pain",
      "iud-comprehensive-guide": "comprehensive-iud-guide",
    };

    // 如果slug是映射别名，重定向到实际slug
    const actualSlug = slugMapping[slug] || slug;
    if (actualSlug !== slug) {
      // 重定向到实际slug（301永久重定向）
      redirect(`/${locale}/articles/${actualSlug}`);
    }

    const article = await getArticleBySlug(actualSlug);
    const articleFetchTime = Date.now() - articleFetchStart;
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(`[PROD-MONITOR] Article fetch: ${articleFetchTime}ms`);
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    // Production monitoring: Article found
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console

    if (!article) {
      // Article not found
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-console
      notFound();
    }

    // 相关文章计算计时
    const relatedArticlesStart = Date.now();
    const relatedArticles = await getRelatedArticles(slug, locale, 3);
    const relatedArticlesTime = Date.now() - relatedArticlesStart;
    // Production monitoring: Related articles calculation
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      "ArticlePage - Related articles found:",
      relatedArticles.length,
    );

    const t = await getTranslations({ locale, namespace: "articlePage" });

    // 确保所有字符串字段都有值，避免undefined
    const title =
      locale === "zh"
        ? article.title_zh || article.titleZh || article.title || ""
        : article.title || "";
    const summary =
      locale === "zh"
        ? article.summary_zh ||
          article.descriptionZh ||
          article.description ||
          ""
        : article.summary || article.description || "";

    // 清理相关文章数据，确保所有字段都是可序列化的
    // 使用固定的后备日期，避免每次渲染时创建新的 Date 对象
    const fallbackDate = new Date().toISOString();
    const cleanedRelatedArticles = relatedArticles.map((relatedArticle) => {
      // 安全地处理日期
      const safePublishedAt = relatedArticle.publishedAt
        ? (() => {
            const date = new Date(relatedArticle.publishedAt);
            return isNaN(date.getTime()) ? fallbackDate : date.toISOString();
          })()
        : fallbackDate;
      const safeUpdatedAt = relatedArticle.updatedAt
        ? (() => {
            const date = new Date(relatedArticle.updatedAt);
            return isNaN(date.getTime()) ? safePublishedAt : date.toISOString();
          })()
        : safePublishedAt;

      return {
        slug: relatedArticle.slug || "",
        title: relatedArticle.title || "",
        title_zh: relatedArticle.title_zh || relatedArticle.titleZh || "",
        summary: relatedArticle.summary || relatedArticle.description || "",
        summary_zh:
          relatedArticle.summary_zh ||
          relatedArticle.descriptionZh ||
          relatedArticle.description ||
          "",
        category: relatedArticle.category || "general",
        tags: Array.isArray(relatedArticle.tags) ? relatedArticle.tags : [],
        publishedAt: safePublishedAt,
        updatedAt: safeUpdatedAt,
        readingTime:
          typeof relatedArticle.readingTime === "number"
            ? relatedArticle.readingTime
            : 10,
        featured:
          typeof relatedArticle.featured === "boolean"
            ? relatedArticle.featured
            : false,
      };
    });
    // 将category转换为安全的翻译键名
    const categoryKey = article.category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "");

    const category =
      locale === "zh"
        ? t(`tags.${categoryKey}`) || article.category
        : t(`tags.${categoryKey}`) || article.category;
    const readingTime = article.readingTime;

    // Check if this is the NSAID article that needs interactive components
    const isNSAIDArticle = slug === "nsaid-menstrual-pain-professional-guide";

    // Check if this article contains Mermaid charts
    // 安全地检查内容，避免 undefined 错误
    const hasMermaidCharts =
      article.content && typeof article.content === "string"
        ? article.content.includes("```mermaid")
        : false;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
    const articleUrl = `${baseUrl}/${locale}/articles/${slug}`;

    // 🔍 渲染准备完成计时
    const renderPrepTime = Date.now() - requestStart;
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Render preparation completed: ${renderPrepTime}ms`,
    );
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    console.log(
      `[PROD-MONITOR] Component breakdown - Article: ${articleFetchTime}ms, Related: ${relatedArticlesTime}ms, Other: ${
        renderPrepTime - articleFetchTime - relatedArticlesTime
      }ms`,
    );

    // 生成增强的结构化数据
    // 安全地处理日期，确保始终是有效的 ISO 字符串
    const safePublishedDate = article.publishedAt
      ? (() => {
          const date = new Date(article.publishedAt);
          return isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString();
        })()
      : new Date().toISOString();
    const safeUpdatedDate = article.updatedAt
      ? (() => {
          const date = new Date(article.updatedAt);
          return isNaN(date.getTime()) ? safePublishedDate : date.toISOString();
        })()
      : safePublishedDate;

    const articleStructuredData = generateArticleStructuredData({
      url: articleUrl,
      title,
      headline: title,
      description: summary || "",
      locale,
      publishedAt: safePublishedDate,
      updatedAt: safeUpdatedDate,
      imageUrl: "/images/article-image.jpg",
    });

    // 生成面包屑结构化数据
    const breadcrumbStructuredData = generateBreadcrumbStructuredData({
      locale,
      path: `/articles/${slug}`,
      breadcrumbs: [
        {
          name: t("breadcrumb.articles") || "Articles",
          url: `${baseUrl}/${locale}/downloads`,
        },
        { name: title || "Article", url: articleUrl },
      ],
    });

    // 🔧 修复 P0: 将日期格式化移到 JSX 外部，避免在 JSX 中创建 Date 对象
    const formattedPublishedDate = (() => {
      const date = new Date(article.publishedAt);
      return isNaN(date.getTime())
        ? new Date().toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")
        : date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US");
    })();

    return (
      <div className="min-h-screen bg-neutral-50">
        {/* 增强的SEO结构化数据 */}
        <ArticleStructuredDataScript data={articleStructuredData} />
        <BreadcrumbStructuredDataScript data={breadcrumbStructuredData} />

        {/* 阅读进度条和返回顶部 */}
        <ReadingProgress locale={locale} />

        {/* Load NSAID interactive components if needed */}
        {isNSAIDArticle && <NSAIDInteractive locale={locale} />}

        <div className="space-y-6 sm:space-y-8">
          {/* Breadcrumb */}
          <div className="container-custom">
            <ServerBreadcrumb
              items={[
                {
                  label: t("breadcrumb.home"),
                  href: `/${locale}`,
                },
                {
                  label: t("breadcrumb.articles"),
                  href: `/${locale}/downloads`,
                },
                { label: title },
              ]}
            />
          </div>

          {/* Article Header */}
          <header className="bg-white border-b border-gray-100">
            <div className="container-custom py-6 sm:py-8">
              <div className="max-w-4xl mx-auto">
                {/* Category and Meta Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600 mb-4">
                  <span className="bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                    {category}
                  </span>
                  <time
                    dateTime={safePublishedDate}
                    className="flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formattedPublishedDate}
                  </time>
                  {readingTime && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {readingTime}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-3 sm:mb-4 leading-tight">
                  {title}
                </h1>

                {/* Summary */}
                {summary && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6 rounded-r-lg">
                    <h2 className="text-sm sm:text-base font-semibold text-blue-800 mb-2">
                      {t("content.articleSummary")}
                    </h2>
                    <p className="text-sm sm:text-base text-blue-700 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Author and Article Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm sm:text-base">
                        {"P"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base text-neutral-800">
                        {"PeriodHub Team"}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        {t("content.healthExpert")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content with Sidebar */}
          <main className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Table of Contents - Mobile */}
                  <div className="lg:hidden mb-6">
                    <TableOfContents locale={locale} />
                  </div>

                  {/* Article Body */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
                    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700">
                      {isNSAIDArticle ? (
                        // For NSAID article, use custom client component
                        <NSAIDContentSimple content={article.content || ""} />
                      ) : hasMermaidCharts ? (
                        // For articles with Mermaid charts, use enhanced Markdown component
                        <MarkdownWithMermaid
                          content={article.content || ""}
                          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700"
                        />
                      ) : (
                        <ArticleContent
                          content={article.content || ""}
                          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-primary prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-li:text-neutral-700"
                        />
                      )}
                    </div>
                  </div>

                  {/* Article Interactions */}
                  <ArticleInteractions
                    articleId={slug}
                    articleTitle={title}
                    locale={locale}
                    className="mb-6"
                  />
                </div>

                {/* Sidebar - Desktop */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-6 space-y-6">
                    {/* Table of Contents - Desktop */}
                    <TableOfContents locale={locale} />

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                        {t("content.quickActions")}
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href={`/${locale}/downloads`}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {t("content.moreArticles")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Medical Disclaimer */}
          <section className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-2 text-sm sm:text-base">
                      {t("content.medicalDisclaimer.title")}
                    </h4>
                    <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                      {t("content.medicalDisclaimer.content")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-2">
                    {t("content.relatedArticles.title")}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600">
                    {t("content.relatedArticles.subtitle")}
                  </p>
                </div>

                {cleanedRelatedArticles.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cleanedRelatedArticles.map((relatedArticle) => {
                      const relatedTitle =
                        locale === "zh"
                          ? relatedArticle.title_zh || relatedArticle.title
                          : relatedArticle.title;
                      const relatedSummary =
                        locale === "zh"
                          ? relatedArticle.summary_zh || relatedArticle.summary
                          : relatedArticle.summary;
                      // 将relatedArticle.category转换为安全的翻译键名
                      const relatedCategoryKey = relatedArticle.category
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w\u4e00-\u9fff-]/g, "");

                      const relatedCategory =
                        t(`tags.${relatedCategoryKey}`) ||
                        relatedArticle.category;

                      return (
                        <Link
                          key={relatedArticle.slug}
                          href={`/${locale}/articles/${relatedArticle.slug}`}
                          className="group block bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-primary-200"
                        >
                          <div className="flex items-center mb-3">
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                              {relatedCategory}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {relatedTitle}
                          </h3>
                          <p className="text-neutral-600 text-sm line-clamp-3 leading-relaxed mb-3">
                            {relatedSummary}
                          </p>
                          <div className="flex items-center text-primary-600 text-sm font-medium">
                            <span>{t("content.relatedArticles.readMore")}</span>
                            <svg
                              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-600 mb-2">
                      {t("content.relatedArticles.moreComing")}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      {t("content.relatedArticles.description")}
                    </p>
                    <Link
                      href={`/${locale}/downloads`}
                      className="inline-flex items-center mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      {t("content.relatedArticles.browseAll")}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } catch {
    // Production monitoring: Error context
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    // eslint-disable-next-line no-console
    notFound();
  }
}
