"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle, AlertCircle } from "lucide-react";
import ClinicalEffectivenessScores from "@/components/ClinicalEffectivenessScores";
import DownloadModal from "@/components/DownloadModal";
import { getPDFResource } from "@/config/pdfResources";

export default function HeroNew() {
  const t = useTranslations("heroNew");
  const rawLocale = useLocale();
  // 确保 locale 类型正确（"en" | "zh"）
  const locale = (rawLocale === "en" || rawLocale === "zh" ? rawLocale : "en") as "en" | "zh";
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<{
    id: string;
    title: string;
    downloadUrl: string;
  } | null>(null);

  // 处理主按钮点击 - 触发 Luna AI
  const handlePrimaryCta = (e: React.MouseEvent) => {
    e.preventDefault();
    // 触发自定义事件来打开 Luna AI
    if (typeof window !== "undefined") {
      // 尝试找到 Luna AI 的按钮并点击（可能需要等待一下让按钮渲染）
      const tryOpenLuna = () => {
        const lunaButton = document.querySelector(
          'button[aria-label*="Luna"], button[aria-label*="luna"], button[aria-label*="Open"]'
        ) as HTMLButtonElement;
        if (lunaButton) {
          lunaButton.click();
        } else {
          // 如果找不到按钮，使用自定义事件
          window.dispatchEvent(new CustomEvent("openLunaAI"));
          // 也尝试延迟重试
          setTimeout(() => {
            const retryButton = document.querySelector(
              'button[aria-label*="Luna"], button[aria-label*="luna"], button[aria-label*="Open"]'
            ) as HTMLButtonElement;
            if (retryButton) {
              retryButton.click();
            }
          }, 100);
        }
      };
      tryOpenLuna();
    }
  };

  // 处理副按钮点击 - 触发下载弹窗
  const handleSecondaryCta = (e: React.MouseEvent) => {
    e.preventDefault();
    const resourceId = "pain-guide";
    const pdfResource = getPDFResource(resourceId);

    if (pdfResource) {
      const htmlFilename = `${resourceId}${locale === "en" ? "-en" : ""}.html`;
      const downloadUrl = `/downloads/${htmlFilename}`;

      setSelectedResource({
        id: resourceId,
        title: pdfResource.title,
        downloadUrl,
      });
      setShowDownloadModal(true);
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-16 lg:pb-24 pt-24"
    >
      <div
        className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* 紧急情况入口按钮 - 右上角固定 */}
      <Link
        href={`/${locale}/downloads?resource=pain-guide`}
        className="fixed top-20 right-4 sm:right-6 z-40 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-105"
        aria-label={t("emergencyButton") || "Emergency Relief"}
      >
        <AlertCircle className="w-4 h-4" />
        <span className="hidden sm:inline">
          {t("emergencyButton") || "Emergency Relief"}
        </span>
        <span className="sm:hidden">紧急</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            {/* ACOG Badge */}
            {t("badge") && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 114 0h1.5a1 1 0 100 2H14a2 2 0 100 4h-2a2 2 0 100-4h.5a1 1 0 100-2H12a2 2 0 01-2-2V5z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("badge")}
              </div>
            )}

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t("h1_prefix")}
              <br />
              <span className="text-gradient">{t("h1_highlight")}</span>
            </h1>

            {/* 副标题 - 新的信任背书文案 */}
            {t("subtitle") && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
                {t("subtitle")}
              </p>
            )}

            {/* 保留原有的评分对比文案（可选显示） */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              <span className="font-semibold text-red-500 dark:text-red-400">
                {t("h2_prefix")}
              </span>
              <br />
              {t("h2_suffix")}{" "}
              <span className="font-semibold text-green-500 dark:text-green-400">
                {t("h2_highlight")}
              </span>{" "}
              {t("h2_end")}
            </p>

            <p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              data-quotable="true"
              data-ai-searchable="true"
              data-entity="DYSMENORRHEA"
            >
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handlePrimaryCta}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center"
              >
                {t("cta_primary")}
              </button>
              <button
                onClick={handleSecondaryCta}
                className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-full font-semibold text-lg hover:border-purple-600 dark:hover:border-purple-400 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center"
              >
                {t("cta_secondary")}
              </button>
            </div>

            {/* No Credit Card Notice */}
            {t("no_credit_card") && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t("no_credit_card")}
              </p>
            )}
          </div>

          {/* Hero Visual - Clinical Effectiveness Scores */}
          <div className="flex justify-center lg:justify-end relative">
            <ClinicalEffectivenessScores />
          </div>
        </div>

        {/* 信任徽章区域 - 在 Hero 内容下方 */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{t("trustBadges.hipaa")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-purple-500" aria-hidden="true" />
              <span>{t("trustBadges.acog")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-blue-500" aria-hidden="true" />
              <span>{t("trustBadges.localStorage")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-pink-500" aria-hidden="true" />
              <span>{t("trustBadges.users")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 下载弹窗 */}
      {selectedResource && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => {
            setShowDownloadModal(false);
            setSelectedResource(null);
          }}
          locale={locale}
          source="hero-section-cta"
          downloadUrl={selectedResource.downloadUrl}
          resourceTitle={selectedResource.title}
          buttonText={
            locale === "en" ? "📥 Send PDF to Email" : "📥 发送 PDF 到邮箱"
          }
        />
      )}
    </section>
  );
}
