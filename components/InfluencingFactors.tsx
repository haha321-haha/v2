"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface InfluencingFactorsProps {
  className?: string;
}

export default function InfluencingFactors({
  className = "",
}: InfluencingFactorsProps) {
  const t = useTranslations(
    "understandingPain.painPatterns.influencingFactors",
  );

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
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

          {/* Physiological factors */}
          <div className="mb-12">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold mb-6 text-purple-700 flex items-center">
                <span className="text-xl mr-2">🧬</span>
                {t("physiologicalFactors.title")}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">
                    {t("physiologicalFactors.ageAndDevelopment.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("physiologicalFactors.ageAndDevelopment.items")
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

                  <h4 className="font-semibold mb-3 text-purple-600 mt-6">
                    {t("physiologicalFactors.bodyCharacteristics.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("physiologicalFactors.bodyCharacteristics.items")
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

                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">
                    {t("physiologicalFactors.healthStatus.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("physiologicalFactors.healthStatus.items")
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

                  <h4 className="font-semibold mb-3 text-purple-600 mt-6">
                    {t("physiologicalFactors.medicationUse.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("physiologicalFactors.medicationUse.items")
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
          </div>

          {/* Lifestyle factors */}
          <div className="mb-12">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold mb-6 text-orange-700 flex items-center">
                <span className="text-xl mr-2">🌱</span>
                {t("lifestyleFactors.title")}
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-3 text-orange-600">
                    {t("lifestyleFactors.dietaryHabits.title")}
                  </h4>
                  <ul className="space-y-2">
                    {(() => {
                      const items = t.raw(
                        "lifestyleFactors.dietaryHabits.items",
                      );
                      const itemsArray = Array.isArray(items)
                        ? items
                        : Object.values(items || {});
                      return itemsArray.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-xs text-gray-700 flex items-start"
                        >
                          <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-3 text-blue-600">
                    {t("lifestyleFactors.exercisePatterns.title")}
                  </h4>
                  <ul className="space-y-2">
                    {(() => {
                      const items = t.raw(
                        "lifestyleFactors.exercisePatterns.items",
                      );
                      const itemsArray = Array.isArray(items)
                        ? items
                        : Object.values(items || {});
                      return itemsArray.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-xs text-gray-700 flex items-start"
                        >
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ));
                    })()}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded">
                  <h4 className="font-semibold mb-3 text-green-600">
                    {t("lifestyleFactors.sleepAndStress.title")}
                  </h4>
                  <ul className="space-y-2">
                    {(() => {
                      const items = t.raw(
                        "lifestyleFactors.sleepAndStress.items",
                      );
                      const itemsArray = Array.isArray(items)
                        ? items
                        : Object.values(items || {});
                      return itemsArray.map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-xs text-gray-700 flex items-start"
                        >
                          <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ));
                    })()}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental factors */}
          <div className="mb-12">
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <h3 className="text-xl font-semibold mb-6 text-pink-700 flex items-center">
                <span className="text-xl mr-2">🌍</span>
                {t("environmentalFactors.title")}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-pink-600">
                    {t("environmentalFactors.environmentalImpact.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("environmentalFactors.environmentalImpact.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-pink-600">
                    {t("environmentalFactors.socialPsychological.title")}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw("environmentalFactors.socialPsychological.items")
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
