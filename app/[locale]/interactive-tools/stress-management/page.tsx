import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import StressAssessmentWidget from "@/components/StressAssessmentWidget";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";
import StressManagementRecommendations from "./components/StressManagementRecommendations";
import PersonalizedRecommendations from "./components/PersonalizedRecommendations";
import StressTechniquesAccordion from "./components/StressTechniquesAccordion";
import BreathingExerciseEmbedded from "./components/BreathingExerciseEmbedded";
import BreadcrumbWrapper from "./components/BreadcrumbWrapper";
import { Suspense } from "react";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.stressManagement",
  });

  return {
    title: t("pageTitle"),
    description: t("description"),
    keywords: t("keywords").split(","),
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/stress-management`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management`, // ✅ 修复：默认英文版本（北美市场优先）
      },
    },
    openGraph: {
      title: t("pageTitle"),
      description: t("description"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function StressManagementPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "interactiveTools.stressManagement",
  });
  const breadcrumbT = await getTranslations({
    locale,
    namespace: "interactiveTools.breadcrumb",
  });

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "stress-management",
    toolName: t("pageTitle"),
    description: t("description"),
    features: [
      t("features.assessment"),
      t("features.personalizedRecommendations"),
      t("features.tracking"),
      t("features.breathingExercise"),
      t("features.meditation"),
      t("features.plan"),
    ],
    category: "HealthApplication",
    rating: {
      value: 4.7,
      count: 850,
    },
    breadcrumbs: [
      {
        name: t("common.breadcrumb.interactiveTools"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: t("title"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/stress-management`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <Suspense fallback={<div className="mb-6 h-6" />}>
            <BreadcrumbWrapper
              items={[
                {
                  label: breadcrumbT("interactiveTools"),
                  href: `/${locale}/interactive-tools`,
                },
                { label: t("title") },
              ]}
            />
          </Suspense>
          {/* Header Section */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
              <span
                className="text-3xl"
                role="img"
                aria-label={t("common.icons.meditation")}
              >
                🧘
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
            {/* 第一层：语义化链接（SEO权重最高） */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-base max-w-3xl mx-auto leading-relaxed">
                {t("headerLinks.intro")}{" "}
                <Link
                  href={`/${locale}/articles/menstrual-stress-management-complete-guide`}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  {t("headerLinks.guideLink")}
                </Link>
                {t("headerLinks.or")}{" "}
                <Link
                  href={`/${locale}/interactive-tools/stress-management/breathing-exercise`}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  {t("headerLinks.breathingLink")}
                </Link>{" "}
                {t("headerLinks.quickRelief")}
              </p>
            </div>
          </header>

          {/* Assessment Widget - Direct Access */}
          <StressAssessmentWidget />

          {/* 个性化建议（第三层：动态推荐） */}
          <PersonalizedRecommendations locale={locale} />

          {/* 呼吸练习器（嵌入式） */}
          <section className="mb-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                {t("sections.breathingExercise.title")}
              </h2>
              <BreathingExerciseEmbedded locale={locale} />
            </div>
          </section>

          {/* 4种技巧手风琴组件 */}
          <StressTechniquesAccordion locale={locale} />

          {/* Progress Card - 保留进度追踪入口 */}
          <section className="mb-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={t("common.icons.progress")}
                  >
                    📈
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {t("progress.title")}
                </h3>
                <p className="text-gray-600 mb-4 text-center">
                  {t("progress.subtitle")}
                </p>
                <div className="text-center">
                  <Link
                    href={`/${locale}/interactive-tools/stress-management/progress`}
                    className="text-purple-600 font-semibold hover:text-purple-700 inline-block"
                  >
                    {t("learnMore")} →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Tips Section */}
          <section className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("tips.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div
                  className="text-4xl mb-3"
                  role="img"
                  aria-label={t("common.icons.dailyHabits")}
                >
                  😌
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.daily.title")}
                </h3>
                <p className="text-blue-100">{t("tips.daily.regularSleep")}</p>
              </div>
              <div className="text-center">
                <div
                  className="text-4xl mb-3"
                  role="img"
                  aria-label={t("common.icons.breathing")}
                >
                  💨
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.emergency.title")}
                </h3>
                <p className="text-blue-100">
                  {t("tips.emergency.deepBreathing")}
                </p>
              </div>
              <div className="text-center">
                <div
                  className="text-4xl mb-3"
                  role="img"
                  aria-label={t("common.icons.prevention")}
                >
                  🛡️
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("tips.prevention.title")}
                </h3>
                <p className="text-blue-100">
                  {t("tips.prevention.identifyTriggers")}
                </p>
              </div>
            </div>
          </section>

          {/* Related Recommendations */}
          <StressManagementRecommendations locale={locale} />

          {/* Medical Disclaimer */}
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-12 rounded-r-lg"
            role="alert"
          >
            <p className="font-bold">{t("common.importantNote")}</p>
            <p className="text-sm mt-1">{t("common.medicalDisclaimer")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
