"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface PainPatternRecognitionProps {
  className?: string;
}

export default function PainPatternRecognition({
  className = "",
}: PainPatternRecognitionProps) {
  const t = useTranslations("understandingPain.painPatterns");

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title and subtitle */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Pain pattern types */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              {t("types.title")}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Menstrual focused type */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3 text-red-700 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  {t("types.menstrualFocused.title")}
                </h4>
                <ul className="space-y-2">
                  {t
                    .raw("types.menstrualFocused.characteristics")
                    .map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Whole period persistent type */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3 text-blue-700 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  {t("types.wholePeriodPersistent.title")}
                </h4>
                <ul className="space-y-2">
                  {t
                    .raw("types.wholePeriodPersistent.characteristics")
                    .map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Premenstrual prominent type */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3 text-orange-700 flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  {t("types.premenstrualProminent.title")}
                </h4>
                <ul className="space-y-2">
                  {t
                    .raw("types.premenstrualProminent.characteristics")
                    .map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Irregular fluctuation type */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  {t("types.irregularFluctuation.title")}
                </h4>
                <ul className="space-y-2">
                  {t
                    .raw("types.irregularFluctuation.characteristics")
                    .map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recording importance */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              {t("recordingImportance.title")}
            </h3>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <p className="text-gray-700 mb-6">
                {t("recordingImportance.description")}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">
                    {t("recordingImportance.recordingElements.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("recordingImportance.recordingElements.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-blue-700">
                    {t("recordingImportance.analysisDimensions.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("recordingImportance.analysisDimensions.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {t("cta.title")}
              </h3>
              <p className="text-gray-600 mb-6">{t("cta.description")}</p>
              <a
                href={t("cta.buttonLink")}
                className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                {t("cta.buttonText")}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
