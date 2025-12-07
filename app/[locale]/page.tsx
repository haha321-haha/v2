import Link from "next/link";
import {
  unstable_setRequestLocale as setRequestLocale,
  getTranslations,
} from "next-intl/server";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroNew from "@/components/layout/HeroNew";
import ComparisonSection from "@/components/sections/ComparisonSection";
import StatsSection from "@/components/sections/StatsSection";

import ScenariosSection from "@/components/sections/ScenariosSection";
import MedicalAdvisoryBoard from "@/components/MedicalAdvisoryBoard";
import UserSuccessStories from "@/components/UserSuccessStories";
import OptimizedSVG from "@/components/ui/OptimizedSVG";
import ReadingProgress from "@/components/ReadingProgress";
import { getHomeStructuredData } from "@/lib/seo/home-structured-data";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";
import { safeStringify } from "@/lib/utils/json-serialization";

// Luna AI is now included in the layout, so it's available on all pages

// 懒加载非首屏组件，减少初始包大小


const PrivacySection = dynamic(
  () => import("@/components/sections/PrivacySection"),
  {
    loading: () => (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
);

const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
  loading: () => (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-80 mx-auto mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  ),
});

// 页面级别的metadata和结构化数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "v2Home" });

  // 使用统一的SEO配置函数
  const { metadata } = generatePageSEO({
    locale: locale as "en" | "zh",
    path: "/",
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: t("metadata.keywords").split(","),
    structuredDataType: "WebPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      featureList: [
        t("metadata.structuredData.featureList.painTracking"),
        t("metadata.structuredData.featureList.cyclePrediction"),
        t("metadata.structuredData.featureList.symptomAssessment"),
        t("metadata.structuredData.featureList.doctorReports"),
        t("metadata.structuredData.featureList.scenarioSolutions"),
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1250",
        bestRating: "5",
      },
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    ...metadata,
    // 确保 openGraph 包含完整的 URL 信息
    openGraph: {
      ...metadata.openGraph,
      url: canonicalUrl,
      title: t("metadata.ogTitle") || metadata.title,
      description: t("metadata.ogDescription") || metadata.description,
      images: [
        {
          url: "/images/hero-bg.jpg",
          width: 1200,
          height: 630,
          alt: t("metadata.ogTitle"),
        },
      ],
    },
    // 确保 twitter 包含完整的元数据
    twitter: {
      ...metadata.twitter,
      title: t("metadata.twitterTitle") || metadata.title,
      description: t("metadata.twitterDescription") || metadata.description,
      images: ["/images/hero-bg.jpg"],
    },
    // 确保 alternates 包含完整的语言和 canonical 信息
    alternates: {
      ...metadata.alternates,
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
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// 生成首页的复合结构化数据
const getStructuredData = async (locale: string) => {
  const t = await getTranslations({ locale, namespace: "" });
  const v2HomeT = await getTranslations({ locale, namespace: "v2Home" });
  return getHomeStructuredData(t as any, v2HomeT as any, locale);
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 添加错误处理，确保 locale 参数正确解析
  let locale: string;
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale || "zh";
  } catch {
    // 如果参数解析失败，使用默认语言
    locale = "zh";
  }

  // 确保 locale 是有效的
  const validLocale = locale === "en" || locale === "zh" ? locale : "zh";

  // 设置请求 locale
  setRequestLocale(validLocale);

  // 获取翻译，添加错误处理
  let t, anchorT, structuredData;
  try {
    // 使用正确的 getTranslations API
    t = await getTranslations({ locale: validLocale, namespace: "" });
    anchorT = await getTranslations({
      locale: validLocale,
      namespace: "anchorTexts",
    });
    structuredData = await getStructuredData(validLocale);
  } catch (error) {
    // 记录原始错误
    // eslint-disable-next-line no-console
    console.error(
      `[HomePage] Failed to get translations for locale ${validLocale}:`,
      error,
    );

    // 如果获取翻译失败，使用默认语言重试
    try {
      t = await getTranslations({ locale: "zh", namespace: "" });
      anchorT = await getTranslations({
        locale: "zh",
        namespace: "anchorTexts",
      });
      structuredData = await getStructuredData("zh");
      // eslint-disable-next-line no-console
      console.log("[HomePage] Fallback to zh locale succeeded");
    } catch (fallbackError) {
      // 如果回退也失败，记录错误并抛出
      // eslint-disable-next-line no-console
      console.error(
        "[HomePage] Fallback to zh locale also failed:",
        fallbackError,
      );
      // 抛出原始错误，保留完整的错误信息
      throw error;
    }
  }

  return (
    <>
      {/* 增强的结构化数据 - 支持多个结构化数据对象 */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeStringify(data),
          }}
        />
      ))}

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300">
        {/* 滚动进度条 */}
        <ReadingProgress locale={validLocale} />

        {/* 主要内容区域 */}
        <main>
          {/* Hero Section with Clinical Effectiveness Scores */}
          <HeroNew />

          {/* Comparison Section (Marketing) */}
          <ComparisonSection />

          {/* Stats Section */}
          <StatsSection />



          {/* Scenarios Section */}
          <ScenariosSection />



          {/* Privacy Section */}
          <PrivacySection />

          {/* CTA Section */}
          <CTASection />

          {/* Medical Advisory Board */}
          <MedicalAdvisoryBoard />

          {/* Features Section */}
          <section className="py-20" aria-labelledby="features-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-16">
                <h2
                  id="features-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  {t("home.features.title")}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {t("home.features.subtitle")}
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Link
                  href={`/${locale}/interactive-tools/cycle-tracker`}
                  className="block"
                >
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                      {t("home.features.tracking.title")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("home.features.tracking.description")}
                    </p>
                    <div className="mt-4 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {anchorT("navigation.main")}
                    </div>
                  </article>
                </Link>

                <Link
                  href={`/${locale}/interactive-tools/symptom-assessment`}
                  className="block"
                >
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {t("home.features.assessment.title")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("home.features.assessment.description")}
                    </p>
                    <div className="mt-4 text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {anchorT("navigation.main")}
                    </div>
                  </article>
                </Link>

                <Link href={`/${locale}/downloads`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                      {t("home.features.resources.title")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("home.features.resources.description")}
                    </p>
                    <div className="mt-4 text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {anchorT("navigation.main")}
                    </div>
                  </article>
                </Link>

                <Link href={`/${locale}/immediate-relief`} className="block">
                  <article className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 group h-full">
                    <div
                      className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                      {t("home.features.immediateRelief.title")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t("home.features.immediateRelief.description")}
                    </p>
                    <div className="mt-4 text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {anchorT("cta.startNow")}
                    </div>
                  </article>
                </Link>
              </div>
            </div>
          </section>

          {/* 统计模块：替换为 SVG 信息图 */}
          <section id="articles-section" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm p-4 sm:p-6">
                <OptimizedSVG
                  src="/images/infographics/stats-infographic.svg"
                  alt={t("healthStatistics.infographicAlt")}
                  className="w-full h-auto"
                  priority={false}
                />
                <p className="mt-2 text-center text-sm text-neutral-500">
                  {t("healthStatistics.dataSource")}
                </p>
              </div>
            </div>
          </section>

          {/* 用户成功案例 */}
          <UserSuccessStories />

          {/* FAQ Section - SEO优化 */}
          <section className="py-20 bg-white" aria-labelledby="faq-heading">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-16">
                <h2
                  id="faq-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  {t("faq.title")}
                </h2>
                <p className="text-xl text-gray-600">{t("faq.subtitle")}</p>
              </header>

              <div className="space-y-6">
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q1.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q1.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q2.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q2.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q3.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q3.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q4.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q4.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q5.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q5.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q6.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q6.answer")}
                  </div>
                </details>

                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t("faq.q7.question")}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {t("faq.q7.answer")}
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section
            className="py-20 bg-gradient-to-r from-purple-100/50 to-pink-100/50"
            aria-labelledby="quick-links-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="text-center mb-12">
                <h2
                  id="quick-links-heading"
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {t("home.quickLinks.title")}
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href={`/${locale}/health-guide`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-purple-200 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <h3 className="text-lg font-semibold text-purple-600 mb-2 group-hover:text-purple-700">
                    {t("home.quickLinks.healthGuide")}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("home.quickLinks.healthGuideDesc")}
                  </p>
                  <div className="mt-3 text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("home.quickLinks.viewNow")}
                  </div>
                </Link>

                <Link
                  href={`/${locale}/interactive-tools/symptom-assessment`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-pink-200 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-pink-600 mb-2 group-hover:text-pink-700">
                    {t("home.quickLinks.assessment.title")}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("home.quickLinks.assessment.description")}
                  </p>
                  <div className="mt-3 text-pink-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("home.quickLinks.assessment.cta")}
                  </div>
                </Link>

                <Link
                  href={`/${locale}/downloads`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-200 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700">
                    {t("home.quickLinks.resources")}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("home.quickLinks.resourcesDesc")}
                  </p>
                  <div className="mt-3 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("home.quickLinks.downloads.cta")}
                  </div>
                </Link>

                <Link
                  href={`/${locale}/scenario-solutions`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-200 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2 group-hover:text-green-700">
                    {t("home.quickLinks.solutions")}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t("home.quickLinks.solutionsDesc")}
                  </p>
                  <div className="mt-3 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("home.quickLinks.scenarios.cta")}
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
