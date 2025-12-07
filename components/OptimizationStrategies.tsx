"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface OptimizationStrategiesProps {
  className?: string;
}

export default function OptimizationStrategies({
  className = "",
}: OptimizationStrategiesProps) {
  const t = useTranslations(
    "understandingPain.painPatterns.optimizationStrategies",
  );

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title and description */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Preventive intervention timing */}
          <div className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6 text-green-700 flex items-center">
                <span className="text-xl mr-2">🎯</span>
                {t("preventiveIntervention.title")}
              </h3>

              <div className="space-y-6">
                {/* Early luteal phase */}
                <div className="bg-white p-4 rounded border border-green-300">
                  <h4 className="font-semibold text-green-600 mb-3">
                    {t("preventiveIntervention.earlyLutealPhase.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("preventiveIntervention.earlyLutealPhase.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Premenstrual days */}
                <div className="bg-white p-4 rounded border border-blue-300">
                  <h4 className="font-semibold text-blue-600 mb-3">
                    {t("preventiveIntervention.premenstrualDays.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("preventiveIntervention.premenstrualDays.items")
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

                {/* Peak pain days */}
                <div className="bg-white p-4 rounded border border-red-300">
                  <h4 className="font-semibold text-red-600 mb-3">
                    {t("preventiveIntervention.peakPainDays.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("preventiveIntervention.peakPainDays.items")
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
              </div>
            </div>
          </div>

          {/* Treatment optimization */}
          <div className="mb-12">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-blue-700 flex items-center">
                <span className="text-xl mr-2">📈</span>
                {t("treatmentOptimization.title")}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">
                    {t("treatmentOptimization.medicationTiming.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("treatmentOptimization.medicationTiming.items")
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
                  <h4 className="font-semibold mb-3 text-green-600">
                    {t("treatmentOptimization.recoveryOptimization.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("treatmentOptimization.recoveryOptimization.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key takeaways */}
          <div className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {t("keyTakeaways.title")}
              </h3>
              <ul className="space-y-3">
                {t
                  .raw("keyTakeaways.items")
                  .map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Medical disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="font-semibold text-red-700 mb-3">
              {t("medicalDisclaimer.title")}
            </h4>
            <p className="text-red-700 text-sm">
              {t("medicalDisclaimer.content")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
