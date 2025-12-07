import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import BreathingExercise from "@/components/BreathingExercise";
import {
  generateToolStructuredData,
  ToolStructuredDataScript,
} from "@/lib/seo/tool-structured-data";

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
  const breathingT = await getTranslations({
    locale,
    namespace: "breathingExercise",
  });

  return {
    title: `${breathingT("title")} - ${t("title")} | PeriodHub`,
    description: breathingT("subtitle"),
    keywords: [
      "breathing exercise",
      "stress relief",
      "4-7-8 breathing",
      "relaxation technique",
      "period stress management",
    ],
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/stress-management/breathing-exercise`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management/breathing-exercise`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management/breathing-exercise`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management/breathing-exercise`,
      },
    },
    openGraph: {
      title: `${breathingT("title")} - ${t("title")}`,
      description: breathingT("subtitle"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function BreathingExercisePage({
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
  const breathingT = await getTranslations({
    locale,
    namespace: "breathingExercise",
  });
  const isZh = locale === "zh";

  // 生成工具结构化数据
  const toolStructuredData = await generateToolStructuredData({
    locale,
    toolSlug: "stress-management/breathing-exercise",
    toolName: breathingT("title"),
    description: breathingT("subtitle"),
    features: [
      isZh ? "4-7-8呼吸法指导" : "4-7-8 Breathing Technique Guidance",
      isZh ? "实时计时器" : "Real-time Timer",
      isZh ? "可视化呼吸指导" : "Visual Breathing Guidance",
      isZh ? "循环计数" : "Cycle Counter",
    ],
    category: "HealthApplication",
    rating: {
      value: 4.8,
      count: 1200,
    },
    breadcrumbs: [
      {
        name: isZh ? "首页" : "Home",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}`,
      },
      {
        name: isZh ? "交互工具" : "Interactive Tools",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools`,
      },
      {
        name: isZh ? "压力管理" : "Stress Management",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/stress-management`,
      },
      {
        name: breathingT("title"),
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/stress-management/breathing-exercise`,
      },
    ],
  });

  return (
    <>
      <ToolStructuredDataScript data={toolStructuredData} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-neutral-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-primary-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools`}
              className="hover:text-primary-600"
            >
              {t("common.breadcrumb.interactiveTools")}
            </Link>
            <span className="mx-2">›</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="hover:text-primary-600"
            >
              {t("title")}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-800">{breathingT("title")}</span>
          </nav>

          {/* Header Section */}
          <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
              <span
                className="text-3xl"
                role="img"
                aria-label={
                  breathingT("iconLabel") || "Breathing exercise icon"
                }
              >
                💨
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {breathingT("title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {breathingT("subtitle")}
            </p>
          </header>

          {/* 全屏呼吸练习器 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <BreathingExercise locale={locale} />
          </div>

          {/* 返回按钮 */}
          <div className="text-center">
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>{isZh ? "返回压力管理" : "Back to Stress Management"}</span>
            </Link>
          </div>

          {/* Medical Disclaimer */}
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded-r-lg"
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
