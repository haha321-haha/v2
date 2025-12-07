import React from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { Locale, locales } from "@/i18n";
import ClientOnly from "@/components/ClientOnly";
import PeriodPainAssessmentTool from "@/app/[locale]/interactive-tools/components/PeriodPainAssessmentTool";
import PainTrackerTool from "@/app/[locale]/interactive-tools/components/PainTrackerTool";
import { MEDICAL_ENTITIES } from "@/lib/seo/medical-entities";

// Server Component面包屑组件
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StoryCase {
  name: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
}

interface FooterSource {
  name: string;
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

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dysmenorrheaGuide" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const canonicalUrl = `${baseUrl}/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`;

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords:
      locale === "zh"
        ? ["痛经", "月经疼痛", "经期管理", "疼痛缓解", "女性健康", "医学指南"]
        : [
            "period pain",
            "menstrual cramps",
            "dysmenorrhea",
            "pain management",
            "women health",
            "medical guide",
          ],
    authors: [{ name: "PeriodHub Health Team" }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${baseUrl}/en/articles/comprehensive-medical-guide-to-dysmenorrhea`,
        "zh-CN": `${baseUrl}/zh/articles/comprehensive-medical-guide-to-dysmenorrhea`,
        "x-default": `${baseUrl}/en/articles/comprehensive-medical-guide-to-dysmenorrhea`,
      },
    },
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      url: canonicalUrl,
      type: "article",
      publishedTime: "2024-12-19",
      authors: ["PeriodHub Health Team"],
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
    },
  };
}

const articleCitations = [
  {
    name: "Dysmenorrhea: Painful Periods",
    url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods",
    author: "ACOG",
    organization: "ACOG",
  },
  {
    name: "Dysmenorrhea",
    url: "https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938",
    author: "Mayo Clinic",
    organization: "Mayo Clinic",
  },
  {
    name: "Menstrual Cramps",
    url: "https://www.womenshealth.gov/menstrual-cycle/menstrual-pain",
    author: "HHS Office on Women's Health",
    organization: "U.S. Department of Health & Human Services",
  },
];

export default async function DysmenorrheaGuidePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "dysmenorrheaGuide" });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const pageUrl = `${baseUrl}/${locale}/articles/comprehensive-medical-guide-to-dysmenorrhea`;

  const condition = MEDICAL_ENTITIES.dysmenorrhea;
  // 生成 Article 结构化数据
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: t("seo.title"),
    headline: t("hero.title"),
    description: t("seo.description"),
    inLanguage: locale === "zh" ? "zh-CN" : "en-US",
    isAccessibleForFree: true,
    datePublished: "2024-12-19T00:00:00+00:00",
    dateModified: "2024-12-19T00:00:00+00:00",
    author: {
      "@type": "Organization",
      name: "PeriodHub Health Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "PeriodHub",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    about: {
      "@type": "MedicalCondition",
      name: condition.name,
      alternateName: locale === "zh" ? "痛经" : "Period Pain",
      associatedAnatomy: {
        "@type": "AnatomicalStructure",
        name: locale === "zh" ? "子宫" : "Uterus",
      },
      code: {
        "@type": "MedicalCode",
        code: condition.icd10,
        codingSystem: "ICD-10",
      },
      sameAs: condition.snomed
        ? `http://snomed.info/id/${condition.snomed}`
        : undefined,
    },
    isBasedOn: articleCitations.map((citation) => ({
      "@type": "MedicalScholarlyArticle",
      name: citation.name,
      url: citation.url,
      author: {
        "@type": "Organization",
        name: citation.author,
      },
    })),
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* SEO结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <ServerBreadcrumb
            items={[
              { label: locale === "zh" ? "首页" : "Home", href: `/${locale}` },
              {
                label: locale === "zh" ? "文章中心" : "Articles",
                href: `/${locale}/downloads`,
              },
              {
                label:
                  locale === "zh"
                    ? "痛经医学指南"
                    : "Dysmenorrhea Medical Guide",
              },
            ]}
          />
        </div>

        <main className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {/* Hero Section */}
          <header className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>
            <div className="bg-rose-50 border-l-4 border-rose-400 p-5 md:p-6 rounded-r-lg max-w-2xl mx-auto text-left shadow-sm">
              <p className="italic text-neutral-700">{t("hero.story")}</p>
            </div>
          </header>

          {/* Scientific Explanation */}
          <section className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-8 flex items-center gap-3">
              <svg
                className="w-8 h-8 text-primary-500"
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
              <span>{t("explanation.title")}</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 font-bold text-xl rounded-full mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">
                  {t("explanation.step1.title")}
                </h3>
                <p className="text-sm text-neutral-600">
                  {t("explanation.step1.description")}
                </p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 font-bold text-xl rounded-full mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">
                  {t("explanation.step2.title")}
                </h3>
                <p className="text-sm text-neutral-600">
                  {t("explanation.step2.description")}
                </p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 font-bold text-xl rounded-full mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg text-primary-700 mb-2">
                  {t("explanation.step3.title")}
                </h3>
                <p className="text-sm text-neutral-600">
                  {t("explanation.step3.description")}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-primary-50 border border-primary-200 text-primary-800 p-4 rounded-lg text-center flex items-center justify-center gap-3">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p>
                <strong>{t("explanation.analogy.title")}</strong>{" "}
                {t("explanation.analogy.description")}
              </p>
            </div>
          </section>

          {/* Interactive Pain Assessment */}
          <section className="bg-primary-50 p-6 md:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6 text-center">
              {t("assessment.title")}
            </h2>
            <p className="text-primary-700 mb-8 text-center">
              {t("assessment.subtitle")}
            </p>

            <ClientOnly
              fallback={
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="animate-pulse">
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-8 bg-neutral-200 rounded mb-4"></div>
                    <div className="h-32 bg-neutral-200 rounded"></div>
                  </div>
                </div>
              }
            >
              <PeriodPainAssessmentTool locale={locale} />
            </ClientOnly>
          </section>

          {/* Pain Tracker */}
          <section className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
              {t("tracker.title")}
            </h2>
            <p className="text-neutral-600 mb-8">{t("tracker.subtitle")}</p>

            <ClientOnly
              fallback={
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="h-32 bg-neutral-200 rounded"></div>
                    <div className="h-32 bg-neutral-200 rounded"></div>
                  </div>
                  <div className="h-48 bg-neutral-200 rounded"></div>
                </div>
              }
            >
              <PainTrackerTool locale={locale} />
            </ClientOnly>
          </section>

          {/* Management Toolkit - Static Content */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10 text-center">
              {t("toolkit.title")}
            </h2>

            <div className="space-y-12">
              {/* Immediate Relief */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-rose-700 mb-6 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>{t("toolkit.immediate.title")}</span>
                </h3>

                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-rose-500"
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
                    <span>{t("toolkit.immediate.heat.title")}</span>
                  </h4>
                  <p className="text-neutral-600 mb-3">
                    {t("toolkit.immediate.heat.description")}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-neutral-600">
                    {t
                      .raw("toolkit.immediate.heat.items")
                      .map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Medication Guide */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-primary-700 mb-6 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                    />
                  </svg>
                  <span>{t("toolkit.medication.title")}</span>
                </h3>

                <div className="space-y-6">
                  {t.raw("toolkit.medication.options").map(
                    (
                      med: {
                        name: string;
                        dosage: string;
                        frequency: string;
                        bestFor?: string;
                      },
                      index: number,
                    ) => (
                      <div key={index}>
                        <h4 className="font-bold text-lg flex items-center gap-2 mb-2">
                          <svg
                            className="w-5 h-5 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                            />
                          </svg>
                          <span>{med.name}</span>
                        </h4>
                        <p className="text-neutral-600 mb-2">{med.dosage}</p>
                        {med.bestFor && (
                          <p className="text-sm text-neutral-500">
                            {med.bestFor}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* When to See a Doctor */}
          <section className="bg-rose-50 border-t-4 border-rose-400 p-6 md:p-10 rounded-b-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-rose-900 mb-8 text-center">
              {t("doctorGuide.title")}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
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
                  <span>{t("doctorGuide.immediate.title")}</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-rose-900">
                  {t
                    .raw("doctorGuide.immediate.points")
                    .map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
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
                  <span>{t("doctorGuide.appointment.title")}</span>
                </h3>
                <ul className="list-disc list-inside space-y-2 text-orange-900">
                  {t
                    .raw("doctorGuide.appointment.points")
                    .map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Real Stories */}
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10">
              {t("stories.title")}
            </h2>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {t.raw("stories.cases").map((story: StoryCase, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg text-left"
                >
                  <h3 className="font-bold text-lg text-primary-800 mb-2">
                    {story.name}
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    <strong>{story.problemTitle}</strong>{" "}
                    {story.problemDescription}
                  </p>
                  <p className="text-neutral-600">
                    <strong>{story.solutionTitle}</strong>{" "}
                    {story.solutionDescription}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-primary-700 text-white p-8 md:p-12 rounded-2xl text-center shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("nextSteps.title")}
            </h2>
            <p className="max-w-3xl mx-auto mb-8">
              {t("nextSteps.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/interactive-tools/pain-tracker`}
                className="btn-secondary bg-white text-primary-700 hover:bg-neutral-100"
              >
                {t("nextSteps.trackPainButton")}
              </Link>
              <Link
                href={`/${locale}/interactive-tools`}
                className="btn-primary bg-primary-600 hover:bg-primary-800"
              >
                {t("nextSteps.exploreToolsButton")}
              </Link>
            </div>
          </section>
        </main>

        {/* Medical Disclaimer */}
        <footer className="mt-16 md:mt-24 pt-8 border-t border-neutral-200">
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg"
            role="alert"
          >
            <p className="font-bold">{t("disclaimer.title")}</p>
            <p className="text-sm mt-2">{t("disclaimer.content")}</p>
          </div>

          <div className="mt-8 text-center text-xs text-neutral-500 space-y-4">
            <div>
              <p>{t("footer.reviewed")}</p>
              <div>
                <p className="font-semibold">{t("footer.sourcesTitle")}</p>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
                  {t
                    .raw("footer.sources")
                    .map((source: FooterSource, index: number) => (
                      <span key={index}>{source.name}</span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
