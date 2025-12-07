import Link from "next/link";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import SafeSmartImage from "@/components/ui/SafeSmartImage";
import BreathingExercise from "@/components/BreathingExercise";
// import Breadcrumb from '@/components/Breadcrumb';
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  Lightbulb,
  Search,
  User,
  Apple,
  Clock,
} from "lucide-react"; // Icons for cards
import { Locale, locales } from "@/i18n";
import {
  generateHreflangConfig,
  HreflangScript,
} from "@/lib/seo/multilingual-seo";
import { safeStringify } from "@/lib/utils/json-serialization";
import { generatePageSEO, StructuredDataType } from "@/lib/seo/page-seo";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });

  const { metadata } = generatePageSEO({
    locale,
    path: "/interactive-tools",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    structuredDataType: "CollectionPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      numberOfItems: 9, // 更新为实际工具数量
      description: t("structuredData.description"),
    },
  });

  return metadata;
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function InteractiveToolsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "interactiveToolsPage",
  });
  const commonT = await getTranslations({ locale, namespace: "common" });

  // 职场健康专栏工具
  const workplaceTools = [
    {
      title: t("workplaceWellness.tools.calendar.title"),
      description: t("workplaceWellness.tools.calendar.description"),
      href: `/${locale}/interactive-tools/workplace-wellness`,
      iconType: "BarChart3",
      iconColor: "text-blue-600",
      cta: t("workplaceWellness.tools.calendar.cta"),
      isPrimary: true,
    },
    {
      title: t("workplaceWellness.tools.stress.title"),
      subtitle: t("workplaceWellness.tools.stress.subtitle"),
      description: t("workplaceWellness.tools.stress.description"),
      duration: t("workplaceWellness.tools.stress.duration"),
      benefits: t("workplaceWellness.tools.stress.benefits"),
      href: `/${locale}/interactive-tools/stress-management`,
      iconType: "Lightbulb",
      iconColor: "text-orange-500",
      cta: t("workplaceWellness.tools.stress.cta"),
      isPrimary: false,
    },
    {
      title: t("workplaceWellness.tools.calculator.title"),
      description: t("workplaceWellness.tools.calculator.description"),
      href: `/${locale}/interactive-tools/period-pain-impact-calculator`,
      iconType: "Search",
      iconColor: "text-purple-600",
      cta: t("workplaceWellness.tools.calculator.cta"),
      isPrimary: false,
    },
  ];

  // 常规工具
  const regularTools = [
    {
      title: t("periodPainAssessment.title"),
      description: t("periodPainAssessment.description"),
      href: `/${locale}/interactive-tools/period-pain-assessment`,
      iconType: "Search",
      iconColor: "text-pink-600",
      cta: t("periodPainAssessment.cta"),
    },
    {
      title: t("symptomAssessment.title"),
      description: t("symptomAssessment.description"),
      href: `/${locale}/interactive-tools/symptom-assessment`,
      iconType: "ClipboardCheck",
      iconColor: "text-primary-600",
      cta: t("symptomAssessment.startButton"),
    },
    {
      title: t("painTracker.title"),
      description: t("painTracker.description"),
      href: `/${locale}/interactive-tools/pain-tracker`,
      iconType: "BarChart3",
      iconColor: "text-secondary-600",
      cta: t("painTracker.startButton"),
    },
    {
      title: t("cycleTracker.title"),
      description: t("cycleTracker.description"),
      href: `/${locale}/interactive-tools/cycle-tracker`,
      iconType: "Calendar",
      iconColor: "text-purple-600",
      cta: t("cycleTracker.cta"),
    },
    {
      title: t("constitutionTest.title"),
      description: t("constitutionTest.description"),
      href: `/${locale}/interactive-tools/constitution-test`,
      iconType: "User",
      iconColor: "text-green-600",
      cta: t("constitutionTest.cta"),
    },
    {
      title: t("nutritionGenerator.title"),
      description: t("nutritionGenerator.description"),
      href: `/${locale}/interactive-tools/nutrition-recommendation-generator`,
      iconType: "Apple",
      iconColor: "text-orange-600",
      cta: t("nutritionGenerator.cta"),
      requiresPrerequisites: true,
    },
  ];

  // Helper function to render icons
  const renderIcon = (iconType: string, iconColor: string) => {
    const iconProps = { className: `w-8 h-8 ${iconColor}` };
    switch (iconType) {
      case "ClipboardCheck":
        return <ClipboardCheck {...iconProps} />;
      case "Search":
        return <Search {...iconProps} />;
      case "Calendar":
        return <Calendar {...iconProps} />;
      case "BarChart3":
        return <BarChart3 {...iconProps} />;
      case "User":
        return <User {...iconProps} />;
      case "Lightbulb":
        return <Lightbulb {...iconProps} />;
      case "Apple":
        return <Apple {...iconProps} />;
      default:
        return <ClipboardCheck {...iconProps} />;
    }
  };

  // 生成hreflang配置
  const hreflangUrls = await generateHreflangConfig({
    locale,
    path: "/interactive-tools",
  });

  // 生成结构化数据
  const { structuredData } = generatePageSEO({
    locale,
    path: "/interactive-tools",
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(","),
    structuredDataType: "CollectionPage" as unknown as StructuredDataType,
    additionalStructuredData: {
      numberOfItems: 9, // 更新为实际工具数量
      description: t("structuredData.description"),
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* hreflang标签 */}
      <HreflangScript hreflangUrls={hreflangUrls} />

      {/* SEO结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStringify(structuredData),
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8 sm:space-y-12 mobile-safe-area">
          {/* Breadcrumb Navigation - Temporarily disabled */}
          {/* <Breadcrumb
            items={[
              {
                label: t("breadcrumb.label")
              }
            ]}
          /> */}

          {/* Page Header - 移动端优化 */}
          <header className="text-center px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-3 sm:mb-4 leading-tight">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </header>

          {/* Tools Introduction Section - 移动端优化 */}
          <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-4 sm:p-6 md:p-8 rounded-xl mx-4 sm:mx-0">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {t("toolsIntroduction")}
                  </p>
                </div>
                <div className="flex justify-center order-first md:order-last">
                  <SafeSmartImage
                    src="/images/tools/assessment-illustration.jpg"
                    alt={t("assessmentIllustrationAlt")}
                    width={400}
                    height={300}
                    type="content"
                    className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg"
                    enableFallback={true}
                    fallbackComponent="OptimizedImage"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 职场健康专栏 - 显眼位置 */}
          <section className="container-custom mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-200 shadow-lg">
              {/* 专栏标题 */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <span className="text-2xl sm:text-3xl text-white">💼</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                  {t("workplaceWellness.title")}
                </h2>
                <p className="text-base sm:text-lg text-blue-700 max-w-3xl mx-auto leading-relaxed">
                  {t("workplaceWellness.description")}
                </p>
              </div>

              {/* 职场工具网格 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {workplaceTools.map((tool) => (
                  <div
                    key={tool.title}
                    className={`card flex flex-col items-center text-center h-full p-6 sm:p-8 ${
                      tool.isPrimary
                        ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-lg"
                        : "bg-white border-2 border-purple-200 shadow-md"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-6 ${
                        tool.isPrimary ? "bg-blue-200" : "bg-purple-100"
                      }`}
                    >
                      {renderIcon(tool.iconType, tool.iconColor)}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight">
                      {tool.title}
                    </h3>

                    {"subtitle" in tool && tool.subtitle && (
                      <p className="text-sm text-gray-500 mb-2">
                        {tool.subtitle}
                      </p>
                    )}

                    <p className="text-sm sm:text-base text-gray-600 mb-4 flex-grow leading-relaxed">
                      {tool.description}
                    </p>

                    {"duration" in tool && tool.duration && (
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{tool.duration}</span>
                      </div>
                    )}

                    {"benefits" in tool && tool.benefits && (
                      <p className="text-sm text-orange-600 font-medium mb-4">
                        {tool.benefits}
                      </p>
                    )}

                    <Link
                      href={tool.href}
                      className={`w-full mobile-touch-target text-sm sm:text-base px-6 py-4 text-center font-semibold rounded-lg transition-all duration-300 ${
                        tool.isPrimary
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
                      }`}
                    >
                      {tool.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 常规工具区域 */}
          <section className="container-custom">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                {t("otherTools.title")}
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                {t("otherTools.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {regularTools.map((tool) => (
                <div
                  key={tool.title}
                  className={`card flex flex-col items-center text-center h-full p-4 sm:p-6 ${
                    tool.requiresPrerequisites
                      ? "relative border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50"
                      : ""
                  }`}
                >
                  {/* 前置条件提示 */}
                  {tool.requiresPrerequisites && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {t("prerequisites.label")}
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-4 sm:mb-6 ${
                      tool.requiresPrerequisites
                        ? "bg-orange-100"
                        : "bg-neutral-100"
                    }`}
                  >
                    {renderIcon(tool.iconType, tool.iconColor)}
                  </div>

                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-800 mb-2 sm:mb-3 leading-tight">
                    {tool.title}
                  </h2>

                  <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 flex-grow leading-relaxed">
                    {tool.description}
                  </p>

                  {/* 前置条件说明 */}
                  {tool.requiresPrerequisites && (
                    <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-700 font-medium mb-1">
                        {t("prerequisites.completeFirst")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                          {t("prerequisites.cycleTracker")}
                        </span>
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                          {t("prerequisites.constitutionTest")}
                        </span>
                      </div>
                    </div>
                  )}

                  {tool.href === "#" ? (
                    <span className="btn-disabled w-full mobile-touch-target text-sm sm:text-base px-4 py-3">
                      {tool.cta}
                    </span>
                  ) : (
                    <Link
                      href={tool.href}
                      className={`w-full mobile-touch-target text-sm sm:text-base px-4 py-3 text-center ${
                        tool.requiresPrerequisites
                          ? "btn-secondary"
                          : "btn-primary"
                      }`}
                    >
                      {tool.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Breathing Exercise Section - 移动端优化 */}
          <section id="breathing-exercise" className="container-custom">
            <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">🫁</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-3 sm:mb-4 leading-tight">
                  {t("breathingExercise.title")}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                  {t("breathingExercise.description")}
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <BreathingExercise locale={locale} />
              </div>

              <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  {t("breathingExercise.usageTips.title")}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">
                      {t("breathingExercise.usageTips.bestTiming.title")}
                    </h4>
                    <ul className="space-y-1">
                      {t
                        .raw("breathingExercise.usageTips.bestTiming.items")
                        .map((item: string, index: number) => (
                          <li key={index}>• {item}</li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      {t("breathingExercise.usageTips.precautions.title")}
                    </h4>
                    <ul className="space-y-1">
                      {t
                        .raw("breathingExercise.usageTips.precautions.items")
                        .map((item: string, index: number) => (
                          <li key={index}>• {item}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to action / Note */}
          <section className="text-center py-8">
            <p className="text-neutral-700">{t("developmentNote")}</p>
          </section>

          {/* Medical Disclaimer */}
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 my-8 rounded-r-lg"
            role="alert"
          >
            <p className="font-bold">{commonT("importantNote")}</p>
            <p className="text-sm">{commonT("medicalDisclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
