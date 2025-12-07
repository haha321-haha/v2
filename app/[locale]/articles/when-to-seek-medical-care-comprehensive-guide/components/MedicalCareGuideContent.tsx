"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Suspense } from "react";
import { Home } from "lucide-react";
import LoadingSystem from "../../../interactive-tools/shared/components/LoadingSystem";
import { ErrorBoundary } from "../../../interactive-tools/shared/components/ErrorBoundary";
import {
  PainAssessmentToolClient,
  SymptomChecklistClient,
  DecisionTreeClient,
  ComparisonTableClient,
} from "./MedicalCareGuideClient";

// Client Component面包屑组件
interface BreadcrumbItem {
  label: string;
  href?: string;
}

function ClientBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
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

export default function MedicalCareGuideContent() {
  const t = useTranslations("medicalCareGuide");
  const locale = useLocale();

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <ClientBreadcrumb
          items={[
            { label: locale === "zh" ? "首页" : "Home", href: `/${locale}` },
            {
              label: locale === "zh" ? "文章中心" : "Articles",
              href: `/${locale}/downloads`,
            },
            { label: locale === "zh" ? "就医指南" : "Medical Care Guide" },
          ]}
        />
      </div>

      <main
        className="max-w-4xl mx-auto space-y-8 md:space-y-12"
        role="main"
        aria-label="医疗护理指南主要内容"
      >
        <article
          role="article"
          aria-labelledby="main-title"
          className="max-w-none"
        >
          {/* 结构化数据注入 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "MedicalWebPage",
                name: t("meta.title"),
                description: t("meta.description"),
              }),
            }}
          />

          {/* 文章头部 */}
          <header
            role="banner"
            aria-label="文章标题区域"
            className="text-center mb-8"
          >
            <h1
              id="main-title"
              className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight"
            >
              {t("header.title")}
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-6">
              {t("header.subtitle")}
            </p>
            {/* 故事引用框 - 参考comprehensive-medical-guide-to-dysmenorrhea */}
            <div className="bg-rose-50 border-l-4 border-rose-400 p-4 md:p-5 rounded-r-lg max-w-2xl mx-auto text-left shadow-sm">
              <p className="italic text-neutral-700 text-sm">
                {t("article.section1.quote")}
              </p>
            </div>
          </header>

          {/* 导言部分 */}
          <section
            role="region"
            aria-labelledby="introduction-title"
            className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300"
          >
            <h2
              id="introduction-title"
              className="text-xl md:text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3"
            >
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>{t("article.section1.title")}</span>
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section1.p1")}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section1.p2")}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section1.p3")}
            </p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed mb-3">
              <li className="text-sm text-gray-700">
                {t("article.section1.li1")}
              </li>
              <li className="text-sm text-gray-700">
                {t("article.section1.li2")}
              </li>
              <li className="text-sm text-gray-700">
                {t("article.section1.li3")}
              </li>
              <li className="text-sm text-gray-700">
                {t("article.section1.li4")}
              </li>
            </ul>
            <p className="text-sm text-gray-700">{t("article.section1.p4")}</p>
          </section>

          <div className="my-8 md:my-12 h-px bg-gray-200"></div>

          {/* 疼痛量化部分 */}
          <section
            role="region"
            aria-labelledby="pain-assessment-title"
            className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300"
          >
            <h2
              id="pain-assessment-title"
              className="text-xl md:text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3"
            >
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>{t("article.section2.title")}</span>
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section2.p1")}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section2.p2")}
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li className="text-sm text-gray-700">
                {t.rich("article.section2.li1", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li className="text-sm text-gray-700">
                {t.rich("article.section2.li2", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
            <p className="text-sm text-gray-700 mb-4">
              {t("article.section2.p3")}
            </p>

            {/* 疼痛评估工具 */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
                <PainAssessmentToolClient />
              </Suspense>
            </ErrorBoundary>
          </section>

          <div className="my-8 md:my-12 h-px bg-gray-200"></div>

          {/* 危险信号部分 */}
          <section
            role="region"
            aria-labelledby="warning-signs-title"
            className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300"
          >
            <h2
              id="warning-signs-title"
              className="text-xl md:text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3"
            >
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>{t("article.section3.title")}</span>
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              {t("article.section3.p1")}
            </p>

            {/* 症状检查清单 */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
                <SymptomChecklistClient />
              </Suspense>
            </ErrorBoundary>

            {/* 7个危险信号网格布局 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_1")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p2", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_2")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p3", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_3")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p4", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_4")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p5", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  5
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_5")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p6", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  6
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_6")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t.rich("article.section3.p7", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg md:col-span-2 lg:col-span-1 hover:bg-rose-100 hover:border-rose-300 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-600 font-bold text-sm rounded-full mx-auto mb-3">
                  7
                </div>
                <h3 className="font-bold text-sm text-rose-700 mb-2">
                  {t("article.section3.h3_7")}
                </h3>
                <p className="text-xs text-neutral-600">
                  {t("article.section3.p8")}
                </p>
              </div>
            </div>

            {/* 对比表格 */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
                <ComparisonTableClient />
              </Suspense>
            </ErrorBoundary>

            <blockquote className="border-l-4 border-red-500 bg-red-50 p-4 my-6">
              <p className="text-red-800 font-medium">
                {t.rich("article.section3.quote", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </blockquote>
          </section>

          <div className="my-8 md:my-12 h-px bg-gray-200"></div>

          {/* 决策树部分 */}
          <section
            role="region"
            aria-labelledby="decision-tree-title"
            className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300"
          >
            <h2
              id="decision-tree-title"
              className="text-xl md:text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3"
            >
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span>{t("article.section4.title")}</span>
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              {t("article.section4.p1")}
            </p>

            {/* 决策树工具 */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingSystem.LoadingSpinner size="lg" />}>
                <DecisionTreeClient />
              </Suspense>
            </ErrorBoundary>
          </section>

          <div className="my-8 md:my-12 h-px bg-gray-200"></div>

          {/* 总结部分 */}
          <section
            role="region"
            aria-labelledby="summary-title"
            className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-all duration-300"
          >
            <h2
              id="summary-title"
              className="text-xl md:text-2xl font-bold text-rose-800 mb-6 flex items-center gap-3"
            >
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t("article.section5.title")}</span>
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section5.p1")}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              {t("article.section5.p2")}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              {t("article.section5.p3")}
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 my-4">
              <h3 className="text-sm font-semibold text-rose-800 mb-2">
                {t("article.section5.callout.title")}
              </h3>
              <p className="text-xs text-rose-700">
                {t("article.section5.callout.text")}
              </p>
            </div>
          </section>

          {/* 医疗免责声明 */}
          <section
            role="complementary"
            aria-labelledby="disclaimer-title"
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3
                id="disclaimer-title"
                className="text-lg font-semibold text-yellow-800 mb-3"
              >
                {t("disclaimer.title")}
              </h3>
              <p className="text-yellow-700 text-sm">{t("disclaimer.text")}</p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
