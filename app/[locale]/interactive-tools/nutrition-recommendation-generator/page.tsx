/**
 * 营养推荐生成器 - 主页面组件
 * 基于ziV1d3d项目集成方案
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";
import { safeStringify } from "@/lib/utils/json-serialization";

// 动态导入营养推荐生成器 - 代码分割优化
const NutritionGenerator = dynamic(
  () => import("./components/NutritionGenerator"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
    ),
  },
);

// 生成页面元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.nutritionRecommendationGenerator.meta",
  });
  const structuredDataT = await getTranslations({
    locale,
    namespace:
      "interactiveTools.nutritionRecommendationGenerator.structuredData",
  });

  const isZh = locale === "zh";
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    keywords: t("keywords"),
    other: {
      "http-equiv": "content-language",
      content: isZh ? "zh-CN" : "en-US",
      "fb:app_id":
        process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "1234567890123456",
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      locale: isZh ? "zh_CN" : "en_US",
      siteName: structuredDataT("providerName"),
      images: [
        {
          url: "/images/nutrition-generator-og.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/images/nutrition-generator-twitter.jpg"],
    },
    alternates: {
      canonical: `https://www.periodhub.health/${locale}/interactive-tools/nutrition-recommendation-generator`,
      languages: {
        zh: "https://www.periodhub.health/zh/interactive-tools/nutrition-recommendation-generator",
        en: "https://www.periodhub.health/en/interactive-tools/nutrition-recommendation-generator",
      },
    },
  };
}

// 主页面组件
export default async function NutritionRecommendationGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const anchorT = await getTranslations({ locale, namespace: "anchorTexts" });
  const breadcrumbT = await getTranslations({
    locale,
    namespace: "interactiveTools.breadcrumb",
  });
  const pageT = await getTranslations({
    locale,
    namespace: "interactiveTools.nutritionRecommendationGenerator",
  });
  const relatedToolsT = await getTranslations({
    locale,
    namespace: "interactiveTools.nutritionRecommendationGenerator.relatedTools",
  });
  const relatedArticlesT = await getTranslations({
    locale,
    namespace:
      "interactiveTools.nutritionRecommendationGenerator.relatedArticles",
  });
  const footerT = await getTranslations({
    locale,
    namespace: "interactiveTools.nutritionRecommendationGenerator.footer",
  });

  const structuredDataT = await getTranslations({
    locale,
    namespace:
      "interactiveTools.nutritionRecommendationGenerator.structuredData",
  });

  const isZh = locale === "zh";
  const title = pageT("title");
  const description = pageT("description");

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale: locale as "en" | "zh",
    toolSlug: "nutrition-recommendation-generator",
    toolName: title,
    description: description,
    features: [
      isZh
        ? "基于月经周期的营养建议"
        : "Menstrual cycle-based nutrition recommendations",
      isZh ? "健康目标导向的饮食方案" : "Health goal-oriented diet plans",
      isZh ? "中医体质个性化调理" : "TCM constitution-based personalization",
      isZh
        ? "科学营养搭配建议"
        : "Scientific nutrition combination suggestions",
    ],
    category: structuredDataT("applicationCategory"),
    rating: {
      value: 4.8,
      count: 1250,
    },
    breadcrumbs: [
      {
        name: breadcrumbT("interactiveTools"),
        url: `https://www.periodhub.health/${locale}/interactive-tools`,
      },
      {
        name: pageT("title"),
        url: `https://www.periodhub.health/${locale}/interactive-tools/nutrition-recommendation-generator`,
      },
    ],
  });

  return (
    <>
      {/* 工具结构化数据 */}
      <ToolStructuredDataScript data={toolStructuredData} />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* 面包屑导航 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb
            items={[
              {
                label: breadcrumbT("interactiveTools"),
                href: `/${locale}/interactive-tools`,
              },
              { label: breadcrumbT("nutritionGenerator") || pageT("title") },
            ]}
          />
        </div>

        {/* 个性化营养之旅介绍组件 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
            {/* 动画图标 */}
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner">
                <svg
                  className="w-8 h-8 text-purple-500 animate-pulse"
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
              {/* 装饰性小图标 */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* 主标题 */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {pageT("journeyTitle")}
            </h2>

            {/* 描述文字 */}
            <p className="text-gray-600 mb-4 leading-relaxed max-w-2xl mx-auto">
              {pageT("description")}
            </p>

            {/* 步骤提示 */}
            <div className="flex justify-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-semibold text-xs">
                    1
                  </span>
                </div>
                {pageT("steps.step1")}
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-semibold text-xs">
                    2
                  </span>
                </div>
                {pageT("steps.step2")}
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-semibold text-xs">
                    3
                  </span>
                </div>
                {pageT("steps.step3")}
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="pt-3 border-t border-purple-100">
              <p className="text-xs text-gray-400">{pageT("tip")}</p>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NutritionGenerator />
        </div>

        {/* 相关推荐区域 */}
        <div className="bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-12">
              {/* 相关工具区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {relatedToolsT("title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 智能周期追踪器 */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedToolsT("cycleTracker.title")}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {relatedToolsT("cycleTracker.description")}
                        </p>
                        <a
                          href={`/${locale}/interactive-tools/cycle-tracker`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          {anchorT("tools.tracker")} &gt;
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 整体健康体质测试 */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600"
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
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedToolsT("constitutionTest.title")}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {relatedToolsT("constitutionTest.description")}
                        </p>
                        <a
                          href={`/${locale}/interactive-tools/constitution-test`}
                          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
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
                          {anchorT("tools.assessment")} &gt;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 相关文章区域 */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {relatedArticlesT("title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 抗炎饮食指南 */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600"
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
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedArticlesT("antiInflammatory.title")}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {relatedArticlesT("antiInflammatory.description")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
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
                            {relatedArticlesT("antiInflammatory.readTime")}
                          </span>
                          <a
                            href={`/${locale}/articles/anti-inflammatory-diet-period-pain`}
                            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            {anchorT("articles.anti_inflammatory")} &gt;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 姜茶缓解痛经指南 */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedArticlesT("gingerTea.title")}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {relatedArticlesT("gingerTea.description")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
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
                            {relatedArticlesT("gingerTea.readTime")}
                          </span>
                          <a
                            href={`/${locale}/articles/ginger-menstrual-pain-relief-guide`}
                            className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            {anchorT("articles.ginger_tea")} &gt;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 有效草药茶配方 */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {relatedArticlesT("herbalTea.title")}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {relatedArticlesT("herbalTea.description")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
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
                            {relatedArticlesT("herbalTea.readTime")}
                          </span>
                          <a
                            href={`/${locale}/articles/herbal-tea-menstrual-pain-relief`}
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            {anchorT("articles.herbal_tea")} &gt;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* 页面底部 */}
        <div className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p className="text-sm">{footerT("text")}</p>
              <p className="text-xs mt-2">{footerT("disclaimer")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
