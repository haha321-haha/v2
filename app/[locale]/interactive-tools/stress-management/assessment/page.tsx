import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";
import { Locale, locales } from "@/i18n";
import StructuredData from "@/components/StructuredData";

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
    title: t("assessment.title") + " - PeriodHub",
    description: t("assessment.subtitle"),
    keywords: t("assessment.keywords"),
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/interactive-tools/stress-management/assessment`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management/assessment`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/interactive-tools/stress-management/assessment`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/interactive-tools/stress-management/assessment`,
      },
    },
    openGraph: {
      title: t("assessment.title") + " - PeriodHub",
      description: t("assessment.subtitle"),
      type: "website",
      locale: locale,
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function StressAssessmentPage({
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

  return (
    <>
      <StructuredData
        type="WebPage"
        title={t("assessment.title")}
        description={t("assessment.subtitle")}
        url={`${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/${locale}/interactive-tools/stress-management/assessment`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {t("common.breadcrumb.home")}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/interactive-tools/stress-management`}
              className="hover:text-blue-600"
            >
              {t("title")}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{t("assessment.title")}</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t("assessment.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("assessment.subtitle")}
            </p>
          </header>

          {/* Assessment Instructions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t("assessment.instructions")}
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-blue-700">
                  {t("assessment.instructionsDetail")}
                </p>
              </div>
            </div>

            {/* Assessment Questions Preview */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("assessment.questionsPreview.title")}
              </h3>

              {["q1", "q2", "q3", "q4", "q5"].map((questionKey, index) => (
                <div key={questionKey} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t(`assessment.questions.${questionKey}.question`)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {t
                          .raw(`assessment.questions.${questionKey}.options`)
                          .map((option: string, optionIndex: number) => (
                            <div
                              key={optionIndex}
                              className="bg-white rounded-lg p-3 text-center text-sm text-gray-600 border border-gray-200"
                            >
                              {option}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Start Assessment Button */}
            <div className="text-center mt-8">
              <Link
                href={`/${locale}/interactive-tools/stress-management/assessment/start`}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <span>{t("startAssessment")}</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t("assessment.benefits.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">
                  {t("assessment.benefits.personalized.title")}
                </h3>
                <p className="text-green-100 text-sm">
                  {t("assessment.benefits.personalized.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-semibold mb-2">
                  {t("assessment.benefits.tracking.title")}
                </h3>
                <p className="text-green-100 text-sm">
                  {t("assessment.benefits.tracking.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-semibold mb-2">
                  {t("assessment.benefits.insights.title")}
                </h3>
                <p className="text-green-100 text-sm">
                  {t("assessment.benefits.insights.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link
              href={`/${locale}/stress-management`}
              className="btn-secondary text-lg px-6 py-3 inline-flex items-center gap-2"
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
              <span>{t("backToTools")}</span>
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
