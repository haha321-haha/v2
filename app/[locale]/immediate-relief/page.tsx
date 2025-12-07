import Link from "next/link";
import {
  getTranslations,
  unstable_setRequestLocale as setRequestLocale,
} from "next-intl/server";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { locales } from "@/i18n";
import { safeStringify } from "@/lib/utils/json-serialization";
// import { URL_CONFIG } from "@/lib/url-config";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "immediateReliefPage" });

  // 获取SEO关键词，支持多种路径
  let seoKeywords: string[] = [];
  try {
    const rawKeywords = t.raw("seoKeywords");
    // 确保返回的是数组
    if (Array.isArray(rawKeywords)) {
      seoKeywords = rawKeywords;
    } else if (typeof rawKeywords === "string") {
      seoKeywords = [rawKeywords];
    } else {
      seoKeywords = [];
    }
  } catch {
    // 如果翻译键不存在，使用空数组
    seoKeywords = [];
  }

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: Array.isArray(seoKeywords) ? seoKeywords.join(", ") : "",
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
      }/${locale}/immediate-relief`,
      languages: {
        "zh-CN": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/zh/immediate-relief`,
        "en-US": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/immediate-relief`,
        "x-default": `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
        }/en/immediate-relief`, // ✅ 修复：默认英文版本
      },
    },
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "article",
      publishedTime: new Date().toISOString(),
    },
  };
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ImmediateReliefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Get translations for the immediate relief page
  const t = await getTranslations({ locale, namespace: "immediateReliefPage" });
  const commonT = await getTranslations({ locale, namespace: "common" });

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t("title"),
    description: t("description"),
    medicalAudience: "Patient",
    about: {
      "@type": "MedicalCondition",
      name: "Dysmenorrhea",
    },
    mainEntity: {
      "@type": "HowTo",
      name: t("structuredData.howTo.name"),
      description: t("structuredData.howTo.description"),
      step: [
        {
          "@type": "HowToStep",
          name: t("structuredData.steps.heatTherapy.name"),
          text: t("structuredData.steps.heatTherapy.text"),
        },
        {
          "@type": "HowToStep",
          name: t("structuredData.steps.breathing.name"),
          text: t("structuredData.steps.breathing.text"),
        },
        {
          "@type": "HowToStep",
          name: t("structuredData.steps.acupressure.name"),
          text: t("structuredData.steps.acupressure.text"),
        },
        {
          "@type": "HowToStep",
          name: t("structuredData.steps.medication.name"),
          text: t("structuredData.steps.medication.text"),
        },
        {
          "@type": "HowToStep",
          name: t("structuredData.steps.medicalCare.name"),
          text: t("structuredData.steps.medicalCare.text"),
        },
      ],
    },
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStringify(structuredData),
        }}
      />
      <div className="container space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: commonT("breadcrumb.immediateRelief"),
              href: `/${locale}/immediate-relief`,
            },
          ]}
        />

        {/* Page Header */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </header>

        {/* Introduction Section */}
        <section className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 md:p-8 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              {t("introTitle")}
            </h2>
            <p className="text-neutral-700 leading-relaxed">{t("introText")}</p>
            <p className="text-neutral-700 leading-relaxed mt-4">
              {t("introText2")}
            </p>
          </div>
        </section>

        {/* Types of Relief Section */}
        <section>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
            {t("typesTitle")}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Heat Therapy */}
            <div className="card border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white min-h-[200px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-700">
                    🔥 {t("heatTherapy.title")}
                  </h3>
                  <p className="text-red-600 font-medium">
                    {t("heatTherapy.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {t("heatTherapyDescription")}
              </p>

              {/* 科学参数显示 */}
              <div className="bg-primary-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-primary-800 mb-2">
                  {t("parameters.scientificParameters")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>{t("labels.temperature")}</strong>
                    {t("parameters.heatTherapy.temperature")}
                  </div>
                  <div>
                    <strong>{t("labels.duration")}</strong>
                    {t("parameters.heatTherapy.duration")}
                  </div>
                  <div>
                    <strong>{t("labels.frequency")}</strong>
                    {t("parameters.heatTherapy.frequency")}
                  </div>
                  <div>
                    <strong>{t("labels.timing")}</strong>
                    {t("parameters.heatTherapy.timing")}
                  </div>
                </div>
                <p className="text-xs text-primary-700 mt-2">
                  <strong>{t("labels.mechanism")}</strong>
                  {t("parameters.heatTherapy.mechanism")}
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/${locale}/articles/heat-therapy-complete-guide`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t("actions.learnMore")}
                </Link>
              </div>
            </div>

            {/* Gentle Movement */}
            <div className="card border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white min-h-[200px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-700">
                    🧘‍♀️ {t("gentleMovement.title")}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {t("gentleMovement.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {t("gentleMovementDescription")}
              </p>

              {/* 瑜伽体式详情 */}
              <div className="bg-secondary-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-secondary-800 mb-3">
                  {t("gentleMovementDetails.yogaPoses.title")}
                </h4>
                <div className="space-y-3">
                  {(Array.isArray(
                    t.raw("gentleMovementDetails.yogaPoses.poses"),
                  )
                    ? t.raw("gentleMovementDetails.yogaPoses.poses")
                    : []
                  ).map(
                    (
                      pose: {
                        name: string;
                        description: string;
                        benefits: string;
                      },
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="border-l-2 border-secondary-300 pl-3"
                      >
                        <h5 className="font-medium text-secondary-700">
                          {pose.name}
                        </h5>
                        <p className="text-sm text-secondary-600 mb-1">
                          {pose.description}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {pose.benefits}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 呼吸练习详情 */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  {t("gentleMovementDetails.breathingExercises.title")}
                </h4>
                <div className="space-y-2">
                  {(Array.isArray(
                    t.raw("gentleMovementDetails.breathingExercises.exercises"),
                  )
                    ? t.raw(
                        "gentleMovementDetails.breathingExercises.exercises",
                      )
                    : []
                  ).map(
                    (
                      exercise: {
                        name: string;
                        steps: string;
                        benefits: string;
                      },
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-300 pl-3"
                      >
                        <h5 className="font-medium text-blue-700">
                          {exercise.name}
                        </h5>
                        <p className="text-sm text-blue-600 mb-1">
                          {exercise.steps}
                        </p>
                        <p className="text-xs text-blue-500">
                          {exercise.benefits}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 使用时机建议 */}
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  {t("gentleMovementDetails.timing.title")}
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• {t("gentleMovementDetails.timing.preventive")}</p>
                  <p>• {t("gentleMovementDetails.timing.during")}</p>
                  <p>• {t("gentleMovementDetails.timing.continuous")}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/${locale}/articles/5-minute-period-pain-relief`}
                  className="text-secondary-600 hover:text-secondary-700 font-medium"
                >
                  {commonT("learnMore")} →
                </Link>
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="card border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white min-h-[200px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">
                    🫁 {t("breathingExerciseTitle")}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {t("breathingExercise.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {t("breathingExerciseDescription")}
              </p>

              {/* 呼吸练习科学参数 */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {t("parameters.breathing.title")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>{t("labels.technique")}</strong>
                    {t("parameters.breathing.technique")}
                  </div>
                  <div>
                    <strong>{t("labels.cycles")}</strong>
                    {t("parameters.breathing.cycles")}
                  </div>
                  <div>
                    <strong>{t("labels.frequency")}</strong>
                    {t("parameters.breathing.frequency")}
                  </div>
                  <div>
                    <strong>{t("labels.timing")}</strong>
                    {t("parameters.breathing.timing")}
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>{t("labels.mechanism")}</strong>
                  {t("parameters.breathing.mechanism")}
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/${locale}/interactive-tools#breathing-exercise`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t("actions.startPractice")}
                </Link>
              </div>
            </div>

            {/* Acupressure */}
            <div className="card border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white min-h-[200px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-700">
                    👐 {t("acupressure.title")}
                  </h3>
                  <p className="text-purple-600 font-medium">
                    {t("acupressure.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {t("acupressureDescription")}
              </p>

              {/* 穴位详情 */}
              <div className="bg-accent-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-accent-800 mb-3">
                  {t("acupressureDetails.title")}
                </h4>
                <div className="space-y-3">
                  {(Array.isArray(t.raw("acupressureDetails.acupoints"))
                    ? t.raw("acupressureDetails.acupoints")
                    : []
                  ).map(
                    (
                      point: {
                        name: string;
                        location: string;
                        method: string;
                        benefits: string;
                      },
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="border-l-2 border-accent-300 pl-3"
                      >
                        <h5 className="font-medium text-accent-700">
                          {point.name}
                        </h5>
                        <p className="text-sm text-accent-600 mb-1">
                          <strong>{t("labels.location")}</strong>
                          {point.location}
                        </p>
                        <p className="text-sm text-accent-600 mb-1">
                          <strong>{t("labels.method")}</strong>
                          {point.method}
                        </p>
                        <p className="text-xs text-accent-500">
                          {point.benefits}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 按摩手法指导 */}
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-purple-800 mb-3">
                  {t("acupressureDetails.technique.title")}
                </h4>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>• {t("acupressureDetails.technique.pressure")}</p>
                  <p>• {t("acupressureDetails.technique.time")}</p>
                  <p>• {t("acupressureDetails.technique.frequency")}</p>
                  <p className="text-xs text-purple-600 mt-2">
                    {t("acupressureDetails.technique.precautions")}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/${locale}/articles/global-traditional-menstrual-pain-relief`}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  {t("actions.learnMore")}
                </Link>
              </div>
            </div>

            {/* OTC Options */}
            <div className="card border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white min-h-[200px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-700">
                    💊 {t("otcOptions.title")}
                  </h3>
                  <p className="text-orange-600 font-medium">
                    {t("otcOptions.subtitle")}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                {t("otcOptionsDescription")}
              </p>

              {/* NSAID科学参数 */}
              <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-neutral-800 mb-2">
                  {t("parameters.nsaid.title")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>{t("labels.dosage")}</strong>
                    {t("parameters.nsaid.dosage")}
                  </div>
                  <div>
                    <strong>{t("labels.timing")}</strong>
                    {t("parameters.nsaid.timing")}
                  </div>
                </div>
                <p className="text-xs text-neutral-700 mt-2">
                  <strong>{t("labels.mechanism")}</strong>
                  {t("parameters.nsaid.mechanism")}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  <strong>{t("labels.contraindications")}</strong>
                  {t("parameters.nsaid.contraindications")}
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/${locale}/articles/when-to-seek-medical-care-comprehensive-guide`}
                  className="text-neutral-600 hover:text-neutral-700 font-medium"
                >
                  {t("actions.learnMore")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Combination Therapy Section */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {t("combinationTherapy.title")}
          </h2>
          <p className="text-neutral-700 mb-6">
            {t("combinationTherapy.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(typeof t.raw("combinationTherapy.combinations") === "object" &&
            t.raw("combinationTherapy.combinations") !== null
              ? Object.values(t.raw("combinationTherapy.combinations"))
              : []
            ).map(
              (
                combination: {
                  level: string;
                  methods: string[];
                  description: string;
                },
                index: number,
              ) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-purple-100"
                >
                  <h3 className="text-lg font-semibold text-purple-700 mb-3">
                    {combination.level}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {Object.values(combination.methods).map(
                      (method: string, methodIndex: number) => (
                        <div
                          key={methodIndex}
                          className="flex items-center text-sm text-purple-600"
                        >
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          {method}
                        </div>
                      ),
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {combination.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Emergency Response Section */}
        <section className="bg-red-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-lg">
          <h2 className="text-2xl font-semibold text-red-800 mb-4">
            {t("emergencyResponse.title")}
          </h2>
          <p className="text-red-700 mb-6">{t("emergencyResponse.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immediate Actions */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-4">
                {t("emergencyResponse.immediateActionsTitle")}
              </h3>
              <ul className="space-y-2">
                {(typeof t.raw("emergencyResponse.immediateActions") ===
                  "object" &&
                t.raw("emergencyResponse.immediateActions") !== null
                  ? Object.values(t.raw("emergencyResponse.immediateActions"))
                  : []
                ).map((action: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-red-600"
                  >
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medical Indicators */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 mb-4">
                {t("emergencyResponse.medicalIndicators.title")}
              </h3>
              <ul className="space-y-2">
                {(typeof t.raw(
                  "emergencyResponse.medicalIndicators.indicators",
                ) === "object" &&
                t.raw("emergencyResponse.medicalIndicators.indicators") !== null
                  ? Object.values(
                      t.raw("emergencyResponse.medicalIndicators.indicators"),
                    )
                  : []
                ).map((indicator: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-red-600"
                  >
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Kit */}
          <div className="mt-6 bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-4">
              {t("emergencyResponse.emergencyKit.title")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(typeof t.raw("emergencyResponse.emergencyKit.items") ===
                "object" &&
              t.raw("emergencyResponse.emergencyKit.items") !== null
                ? Object.values(t.raw("emergencyResponse.emergencyKit.items"))
                : []
              ).map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-red-600"
                >
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Finding What Works Section */}
        <section className="bg-neutral-100 p-6 md:p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            {t("findingWhatWorksTitle")}
          </h2>
          <p className="text-neutral-700 leading-relaxed">
            {t("findingWhatWorksText")}
          </p>
          <p className="text-neutral-700 leading-relaxed mt-4">
            {t("findingWhatWorksText2")}
          </p>
        </section>

        {/* Related Content Section */}
        <section>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
            {t("contentSectionTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card group block">
              <Link href={`/${locale}/scenario-solutions/emergency-kit`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">📦</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("workTipsTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("workTipsDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.viewChecklist")}
                </span>
              </Link>
            </div>

            <div className="card group block">
              <Link href={`/${locale}/articles/5-minute-period-pain-relief`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">📊</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("meditationTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("meditationDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.startAssessment")}
                </span>
              </Link>
            </div>

            {/* 新增：NSAIDs药物指南卡片 */}
            <div className="card group block">
              <Link href={`/${locale}/downloads/medication-guide`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🧮</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("nsaidGuideTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("nsaidGuideDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.viewGuide")}
                </span>
              </Link>
            </div>

            {/* 新增：生活场景全覆盖卡片 */}
            <div className="card group block">
              <Link href={`/${locale}/scenario-solutions`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🏠</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("scenarioSolutionsTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("scenarioSolutionsDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.viewSolutions")}
                </span>
              </Link>
            </div>

            {/* 新增：热敷疗法指南卡片 */}
            <div className="card group block">
              <Link href={`/${locale}/articles/heat-therapy-complete-guide`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🔥</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("heatTherapyGuideTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("heatTherapyGuideDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.viewMethods")}
                </span>
              </Link>
            </div>

            {/* 新增：饮食调理方案卡片 */}
            <div className="card group block">
              <Link href={`/${locale}/articles/period-friendly-recipes`}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🥗</span>
                  <h3 className="text-xl font-semibold text-primary-600 group-hover:text-primary-700">
                    {t("dietaryPlanTitle")}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4">
                  {t("dietaryPlanDescription")}
                </p>
                <span className="font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
                  {t("actions.viewDietPlan")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Medical Disclaimer */}
        <section className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
          <p className="text-neutral-700">
            <strong className="text-primary-700">{t("disclaimerTitle")}</strong>
            {t("disclaimerText")}
          </p>
        </section>
      </div>
    </>
  );
}
