"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-gray-100 dark:bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
              <span className="font-display font-semibold text-xl dark:text-white">
                PeriodHub
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("tagline")}
            </p>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">
              {t("toolsTitle")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href={`/${locale}/interactive-tools`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("toolsLinks.symptomChecker")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/interactive-tools/cycle-tracker`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("toolsLinks.cycleTracker")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/interactive-tools`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("toolsLinks.painDiary")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/interactive-tools`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("toolsLinks.doctorReports")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">
              {t("resourcesTitle")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href={`/${locale}/downloads`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("resourcesLinks.medicalGuides")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/natural-therapies`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("resourcesLinks.naturalRemedies")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/health-guide`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("resourcesLinks.emergencyGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/downloads`}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("resourcesLinks.researchPapers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">
              {t("legalTitle")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("legalLinks.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("legalLinks.hipaaCompliance")}
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("legalLinks.termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {t("legalLinks.medicalDisclaimer")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}






